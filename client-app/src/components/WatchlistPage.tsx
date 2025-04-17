import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Watchlist.module.scss';
import { getUserId } from '../utils/fetchUserRole';

interface WatchlistItem {
  WatchListID: number;
  WatchListContentID: number;
  WatchListUserID: number;
  ContentName?: string;
  ContentImage?: string;
}

const WatchlistPage: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const fetchUserId = async () => {
    try {
      const ID = await getUserId();
      setUserID(ID || null);
    } catch (err) {
      console.error('Ошибка получения ID пользователя:', err);
      setError('Не удалось загрузить пользователя.');
    }
  };

  const fetchWatchlist = async (userID: string | null) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/watchlists`, {
        params: { WatchListUserID: userID },
      });
      console.log('Базовый список:', response.data);
      const baseWatchlist = response.data;

      const detailedWatchlist = await Promise.all(
        baseWatchlist.map(async (item: WatchlistItem) => {
          try {
            const contentResponse = await axios.get(
              `http://localhost:5000/api/contents/${item.WatchListContentID}`
            ); 
            
            return {
              ...item,
              ContentName: contentResponse.data.ContentName,
              ContentImage: contentResponse.data.ContentImage,
              ContentType: contentResponse.data.ContentType
            };
          } catch (err) {
            console.error(`Ошибка загрузки данных контента для ID ${item.WatchListContentID}:`, err);
            return { ...item };
          }
        })
      );

      setWatchlist(detailedWatchlist);
    } catch (err) {
      console.error('Ошибка при загрузке желаемого:', err);
      setError('Не удалось загрузить желаемое.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (contentID: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/watchlist`, {
        data: { WatchListUserID: userID, WatchListContentID: contentID },
      });
      setWatchlist((prev) => prev.filter((item) => item.WatchListContentID !== contentID));
    } catch (err) {
      console.error('Ошибка при удалении из желаемого:', err);
      setError('Не удалось удалить контент из желаемого.');
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userID) {
      fetchWatchlist(userID);
    }
  }, [userID]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.watchlistContainer}>
      <h1>Мой список желаемого</h1>
      <div className={styles.underHeader}>
        <button 
        className={styles.backButton}
        onClick={handleBack}
        >
          Назад
        </button>
        </div>
      {watchlist.length === 0 ? (
        <p>Ваш список желаемого пуст.</p>
      ) : (
        <div className={styles.watchlistGrid}>
          {watchlist.map((item) => (
            <div key={item.WatchListID} className={styles.watchlistItem}>
              <Link to={`/content/${item.WatchListContentID}`}>
                <img
                  src={item.ContentImage || '../public/placeholder.jpg'}
                  alt={item.ContentName || 'Изображение недоступно'}
                  className={styles.contentImage}
                />
                <h3 className={styles.title}>{item.ContentName || 'Название недоступно'}</h3>
              </Link>
              <button
                className={styles.removeButton}
                onClick={() => handleRemoveFromWatchlist(item.WatchListContentID)}
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

export default WatchlistPage;
