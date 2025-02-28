import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Watchlist.module.scss';
import { getUserId } from '../utils/fetchUserRole';

// Интерфейс для данных контента
interface LikeItem {
  LikeID: number;
  LikeContentID: number;
  LikeUserID: number;
  ContentName?: string;
  ContentImage?: string;
}

const LikesPage: React.FC = () => {
  const [like, setLike] = useState<LikeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  // Получение ID пользователя
  const fetchUserId = async () => {
    try {
      const ID = await getUserId();
      setUserID(ID || null);
    } catch (err) {
      console.error('Ошибка получения ID пользователя:', err);
      setError('Не удалось загрузить пользователя.');
    }
  };

  // Получение списка
  const fetchLike = async (userID: string | null) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/likes`, {
        params: { LikeUserID: userID },
      });
      console.log('Базовый список:', response.data);
      const baseLike = response.data;

      const detailedLike = await Promise.all(
        baseLike.map(async (item: LikeItem) => {
          try {
            const contentResponse = await axios.get(
              `http://localhost:5000/api/contents/${item.LikeContentID}`
            ); 
            
            return {
              ...item,
              ContentName: contentResponse.data.ContentName,
              ContentImage: contentResponse.data.ContentImage,
              ContentType: contentResponse.data.ContentType
            };
          } catch (err) {
            console.error(`Ошибка загрузки данных контента для ID ${item.LikeContentID}:`, err);
            return { ...item };
          }
        })
      );

      setLike(detailedLike);
    } catch (err) {
      console.error('Ошибка при загрузке желаемого:', err);
      setError('Не удалось загрузить понравившееся.');
    } finally {
      setLoading(false);
    }
  };

  // Удаление контента из списка
  const handleRemoveFromLike = async (contentID: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/like`, {
        data: { LikeUserID: userID, LikeContentID: contentID },
      });
      setLike((prev) => prev.filter((item) => item.LikeContentID !== contentID));
    } catch (err) {
      console.error('Ошибка при удалении из желаемого:', err);
      setError('Не удалось удалить контент из желаемого.');
    }
  };

  // Загрузка ID пользователя при монтировании
  useEffect(() => {
    fetchUserId();
  }, []);

  // Загрузка списка при изменении userID
  useEffect(() => {
    if (userID) {
      fetchLike(userID);
    }
  }, [userID]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.watchlistContainer}>
      <h1>Мой список понравившегося</h1>
      <div className={styles.underHeader}>
        <button 
        className={styles.backButton}
        onClick={handleBack}
        >
          Назад
        </button>
        </div>
      {like.length === 0 ? (
        <p>Ваш список понравившегося пуст.</p>
      ) : (
        <div className={styles.watchlistGrid}>
          {like.map((item) => (
            <div key={item.LikeID} className={styles.watchlistItem}>
              <Link to={`/content/${item.LikeContentID}`}>
                <img
                  src={item.ContentImage || '../public/placeholder.jpg'}
                  alt={item.ContentName || 'Изображение недоступно'}
                  className={styles.contentImage}
                />
                <h3 className={styles.title}>{item.ContentName || 'Название недоступно'}</h3>
              </Link>
              <button
                className={styles.removeButton}
                onClick={() => handleRemoveFromLike(item.LikeContentID)}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikesPage;
