import React, { useEffect, useState } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import { getUserId } from '../utils/fetchUserRole';
import axios from 'axios';
import styles from '../styles/ContentPage.module.scss';
import StarRatingInput from './StarRatingInput';
import Header from './Header';
import Footer from './Footer';
import ReviewComponent from './ReviewConponent';

// Интерфейс для данных контента
interface Content {
  ContentID: number;
  ContentName: string;
  ContentDescription: string;
  ContentGenre: string;
  ContentDate: string;
  ContentImage: string;
  ContentCrew: string;
  rating: number | null;
}

const ContentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userID, setUserID] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const [isViewed, setIsViewed] = useState<boolean | null>(null);
  const [isWatchListed, setIsWatchListed] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlaylists, setSelectedPlaylists] = useState<number[]>([]);


  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const fetchPlaylists = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('Токен не найден');
        return;
      }
      const response = await axios.get('http://localhost:5000/api/playlists/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        }
      );
      setPlaylists(response.data || []);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Ошибка загрузки плейлистов:', err);
    }
  };

  const handleAddToPlaylists = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('Токен не найден');
        return;
      }
  
      if (selectedPlaylists.length === 0) {
        alert('Пожалуйста, выберите хотя бы один плейлист.');
        return;
      }
  
      const invalidPlaylists = selectedPlaylists.filter(id => isNaN(id));
      if (invalidPlaylists.length > 0) {
        alert('Некоторые идентификаторы плейлистов некорректны.');
        return;
      }
  
      await Promise.all(
        selectedPlaylists.map((playlistId) => 
          axios.post(
            `http://localhost:5000/api/playlists/content/${playlistId}/${id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            }
          )
        )
      );
  
      setIsModalOpen(false);
      setSelectedPlaylists([]);
      alert('Контент успешно добавлен в плейлист(ы).');
    } catch (err) {
      console.error('Ошибка добавления в плейлист:', err);
      alert('Ошибка при добавлении контента в плейлист.');
    }
  };
  
  console.log('Playlists:', playlists);
  
  
  const fetchContent = async (userID: string | null) => {
    try {
      setLoading(true);

      const [contentRes, ratingsRes, likeRes, viewRes, watchlistRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/contents/${id}`),
        axios.get(`http://localhost:5000/api/ratings/${id}`),
        axios.get(`http://localhost:5000/api/like?LikeUserID=${userID}&LikeContentID=${id}`),
        axios.get(`http://localhost:5000/api/view?ViewUserID=${userID}&ViewContentID=${id}`),
        axios.get(`http://localhost:5000/api/watchlist?WatchListUserID=${userID}&WatchListContentID=${id}`)
      ]);

      const averageRating = ratingsRes.data.length
        ? ratingsRes.data.reduce((sum: number, r: any) => sum + r.RatingScore, 0) /
          ratingsRes.data.length
        : null;

      // Получение пользовательского рейтинга
      let userRating: number | null = null;
      try {
        const userRatingRes = await axios.get(
          `http://localhost:5000/api/ratings/user/${userID}/content/${id}`
        );
        userRating = userRatingRes.data?.RatingScore || null;
      } catch (err) {
        
        if (axios.isAxiosError(err) && err.response?.status !== 404) {
          throw err;
        }
      }

      const isLiked = likeRes.data && Object.keys(likeRes.data).length > 0;
      const isViewed = viewRes.data && Object.keys(viewRes.data).length > 0;
      const isWatchListed = watchlistRes.data && Object.keys(watchlistRes.data).length > 0;

      setContent({ ...contentRes.data, rating: averageRating });
      setIsLiked(isLiked);
  
      setIsViewed(isViewed);

      setIsWatchListed(isWatchListed);
      
      setUserRating(userRating);

    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      setError('Ошибка загрузки контента');
    } finally {
      setLoading(false);
    }
  };


  const fetchUserId = async () => {
    try {
      const ID = await getUserId();
      setUserID(ID || null);
      await fetchContent(ID);
    } catch (err) {
      console.error('Ошибка получения ID пользователя:', err);
      setError('Не удалось загрузить пользователя.');
    }
  };

  useEffect(() => {
    fetchUserId();
  }, [id]);



  // Обновление рейтинга
  const handleRatingSubmit = async (rating: number | null) => {
    if (!userID || !content || rating === null) return;

    try {
      await axios.post('http://localhost:5000/api/ratings', {
        RatingUserID: userID,
        RatingContentID: content.ContentID,
        RatingScore: rating,
      });
      fetchContent(userID);
    } catch (err) {
      console.error('Ошибка при обновлении рейтинга:', err);
    }
  };

  // Удаление рейтинга
  const handleDeleteRating = async () => {
    if (!userID || !content) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/ratings/user/${userID}/content/${content.ContentID}`
      );
      if (response.data) {
        await axios.delete(`http://localhost:5000/api/ratings/${response.data.RatingID}`);
        fetchContent(userID);
      }
    } catch (err) {
      console.error('Ошибка удаления рейтинга:', err);
    }
  };

  // Управление лайками
  const handleLikeContent = async () => {
    if (!userID || !content) return;
    
    try {
        const response = await axios.post('http://localhost:5000/api/like', {
            LikeUserID: userID,
            LikeContentID: content.ContentID,
        });

        if (response.status === 201) {
            setIsLiked(true);
        } else if (response.status === 200) {
          setIsLiked(false);
        }

    } catch (err) {
        console.error('Ошибка при обработке лайка:', err);
    } finally {
        //fetchContent(userID);
    }
};


const handleViewContent = async () => {
  if (!userID || !content) return;
    
    try {
        const response = await axios.post('http://localhost:5000/api/view', {
            ViewUserID: userID,
            ViewContentID: content.ContentID,
        });

        if (response.status === 201) {
            setIsViewed(true);
        } else if (response.status === 200) {
          setIsViewed(false);
        }

    } catch (err) {
        console.error('Ошибка при обработке лайка:', err);
    } finally {
        //fetchContent(userID);
    }
};

const handleWatchList = async () => {
  if (!userID || !content) return;
    
    try {
        const response = await axios.post('http://localhost:5000/api/watchlist', {
            WatchListUserID: userID,
            WatchListContentID: content.ContentID,
        });

        if (response.status === 201) {
            setIsWatchListed(true);
        } else if (response.status === 200) {
          setIsWatchListed(false);
        }

    } catch (err) {
        console.error('Ошибка при обработке лайка:', err);
    } finally {
        fetchContent(userID);
    }
};




  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;


  return (
    <div className={styles.main}>
      <Header />
      {isModalOpen && (
  <div className={styles.modal}>
    <div className={styles.modalContent}>
      <h3>Выберите плейлист(ы):</h3>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.PlaylistID}>
            <label className={styles.labelPlaylist}>
              <p className={styles.pPlaylistName}>{playlist.PlaylistName}</p>

              <div className={styles.checkboxWrapper}>
                <input
                  type="checkbox"
                  id={`cbx-${playlist.PlaylistID}`}
                  className={styles.checkbox}
                  value={playlist.PlaylistID}
                  onChange={(e) => {
                    console.log('Playlist ID:', playlist.PlaylistID);
                    const id = parseInt(e.target.value);
                    if (isNaN(id)) {
                      console.error('Ошибка при преобразовании playlist.id');
                      return;
                    }
                    setSelectedPlaylists((prev) =>
                      e.target.checked ? [...prev, id] : prev.filter((pid) => pid !== id)
                    );
                  }}
                />
                <label htmlFor={`cbx-${playlist.PlaylistID}`} className={styles.toggle}><span></span></label>
              </div>
              
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleAddToPlaylists}>Добавить</button>
      <button onClick={() => setIsModalOpen(false)}>Закрыть</button>
    </div>
  </div>
)}


      
      <div className={styles.underHeader}>
        <button 
        className={styles.backButton}
        onClick={handleBack}
        >
          Назад
        </button>
      </div>
      <div className={styles.contentPage}>
        {content && (
          <div className={styles.wrapper}>
            <div className={styles.imageContainer}>
              <img src={content.ContentImage} alt={content.ContentName} className={styles.image} />
            </div>

            <div className={styles.infoContainer}>
              <h1 className={styles.title}>{content.ContentName}</h1>
              <p><strong>Жанр:</strong> {content.ContentGenre}</p>
              <p><strong>Автор:</strong> {content.ContentCrew}</p>
              <p><strong>Дата выхода:</strong> {new Date(content.ContentDate).toLocaleDateString('ru-RU')}</p>
              <p><strong>Описание:</strong> {content.ContentDescription}</p>
              <p>
                <strong>Рейтинг RateVerse:</strong>{' '}
                {content.rating ? content.rating.toFixed(1) : 'Нет рейтинга'}
              </p>
            </div>

            {/* Панель справа */}
            {userID != '0' ? (
              <div className={styles.sidebar}>
                <div className={styles.inSidebar}>
                <div className={styles.actions}>
                  <div className={styles.actionButtonContainer}>
                    <button 
                    onClick={handleWatchList}
                    >
                      {isWatchListed ? (
                        <svg width="50" height="50" viewBox="0 0 132 132" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_133_48)">
                        <path d="M126.5 99H110V82.5C110 81.0413 109.421 79.6424 108.389 78.6109C107.358 77.5795 105.959 77 104.5 77C103.042 77 101.643 77.5795 100.611 78.6109C99.5798 79.6424 99.0003 81.0413 99.0003 82.5V99H82.5003C81.0416 99 79.6427 99.5795 78.6112 100.611C77.5798 101.642 77.0003 103.041 77.0003 104.5C77.0003 105.959 77.5798 107.358 78.6112 108.389C79.6427 109.421 81.0416 110 82.5003 110H99.0003V126.5C99.0003 127.959 99.5798 129.358 100.611 130.389C101.643 131.421 103.042 132 104.5 132C105.959 132 107.358 131.421 108.389 130.389C109.421 129.358 110 127.959 110 126.5V110H126.5C127.959 110 129.358 109.421 130.389 108.389C131.421 107.358 132 105.959 132 104.5C132 103.041 131.421 101.642 130.389 100.611C129.358 99.5795 127.959 99 126.5 99ZM60.5003 38.5V63.723L45.6118 78.6115C45.0865 79.1189 44.6675 79.7258 44.3793 80.3968C44.091 81.0678 43.9393 81.7895 43.9329 82.5198C43.9266 83.2501 44.0658 83.9743 44.3423 84.6503C44.6188 85.3262 45.0272 85.9403 45.5436 86.4567C46.0601 86.9731 46.6741 87.3815 47.3501 87.658C48.026 87.9346 48.7502 88.0737 49.4805 88.0674C50.2108 88.061 50.9325 87.9093 51.6035 87.6211C52.2746 87.3328 52.8815 86.9138 53.3888 86.3885L69.8888 69.8885C70.9203 68.8573 71.5 67.4586 71.5003 66V38.5C71.5003 37.0413 70.9209 35.6424 69.8894 34.6109C68.858 33.5795 67.459 33 66.0003 33C64.5416 33 63.1427 33.5795 62.1112 34.6109C61.0798 35.6424 60.5003 37.0413 60.5003 38.5ZM81.0043 118.932C69.3083 122.228 56.8493 121.552 45.5786 117.01C34.3078 112.468 24.8619 104.316 18.7201 93.8304C12.5784 83.3451 10.0877 71.1189 11.6382 59.0666C13.1887 47.0142 18.6928 35.8165 27.2884 27.2271C35.884 18.6377 47.0857 13.1418 59.1392 11.6C71.1926 10.0583 83.417 12.5578 93.8979 18.7072C104.379 24.8565 112.524 34.3083 117.058 45.5824C121.592 56.8564 122.259 69.3159 118.954 81.0095C118.731 81.7125 118.651 82.4533 118.719 83.1879C118.788 83.9224 119.004 84.6357 119.353 85.2852C119.703 85.9346 120.18 86.5071 120.756 86.9685C121.332 87.4299 121.994 87.7707 122.704 87.9707C123.414 88.1708 124.157 88.2259 124.889 88.1329C125.621 88.0398 126.327 87.8005 126.964 87.4291C127.602 87.0578 128.158 86.562 128.6 85.9712C129.042 85.3805 129.36 84.7069 129.536 83.9905C133.504 69.9478 132.702 54.9855 127.255 41.4477C121.808 27.9099 112.024 16.5614 99.4361 9.17987C86.8482 1.79838 72.1673 -1.19903 57.6933 0.657223C43.2193 2.51347 29.77 9.11851 19.4521 19.4376C9.13426 29.7567 2.53085 43.2069 0.676352 57.6811C-1.17815 72.1553 1.82103 86.8358 9.20404 99.4228C16.5871 112.01 27.9368 121.792 41.4753 127.238C55.0137 132.683 69.9761 133.484 84.0183 129.514C84.7286 129.331 85.3951 129.009 85.9788 128.565C86.5624 128.121 87.0514 127.564 87.417 126.929C87.7825 126.293 88.0172 125.59 88.1073 124.863C88.1973 124.135 88.1409 123.396 87.9414 122.691C87.7419 121.985 87.4032 121.326 86.9454 120.754C86.4876 120.181 85.9198 119.705 85.2755 119.355C84.6312 119.005 83.9234 118.787 83.1936 118.714C82.4639 118.642 81.727 118.716 81.0263 118.932H81.0043Z" fill="#5941A9"/>
                        <ellipse cx="66" cy="66.5" rx="56" ry="57.5" fill="#5941A9"/>
                        <circle cx="104" cy="104" r="28" fill="#5941A9"/>
                        <path d="M120 104H88" stroke="#010004" strokeWidth="7" strokeLinecap="round"/>
                        <path d="M71.2 38C71.2 35.1281 68.8719 32.8 66 32.8C63.1281 32.8 60.8 35.1281 60.8 38L71.2 38ZM60.8 38L60.8 66L71.2 66L71.2 38L60.8 38Z" fill="#010004"/>
                        <path d="M49 83.0499L65.9499 66" stroke="#010004" strokeWidth="10.4" strokeLinecap="round"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_133_48">
                        <rect width="132" height="132" fill="white"/>
                        </clipPath>
                        </defs>
                        </svg>
                      ) : (
                        <svg width="50" height="50" viewBox="0 0 132 132" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_133_53)">
                        <circle cx="66" cy="66" r="55" fill="#010004"/>
                        <path d="M126.5 99H110V82.5C110 81.0413 109.421 79.6424 108.389 78.6109C107.358 77.5795 105.959 77 104.5 77C103.042 77 101.643 77.5795 100.611 78.6109C99.5798 79.6424 99.0003 81.0413 99.0003 82.5V99H82.5003C81.0416 99 79.6427 99.5795 78.6112 100.611C77.5798 101.642 77.0003 103.041 77.0003 104.5C77.0003 105.959 77.5798 107.358 78.6112 108.389C79.6427 109.421 81.0416 110 82.5003 110H99.0003V126.5C99.0003 127.959 99.5798 129.358 100.611 130.389C101.643 131.421 103.042 132 104.5 132C105.959 132 107.358 131.421 108.389 130.389C109.421 129.358 110 127.959 110 126.5V110H126.5C127.959 110 129.358 109.421 130.389 108.389C131.421 107.358 132 105.959 132 104.5C132 103.041 131.421 101.642 130.389 100.611C129.358 99.5795 127.959 99 126.5 99ZM60.5003 38.5V63.723L45.6118 78.6115C45.0865 79.1189 44.6675 79.7258 44.3793 80.3968C44.091 81.0678 43.9393 81.7895 43.9329 82.5198C43.9266 83.2501 44.0658 83.9743 44.3423 84.6503C44.6188 85.3262 45.0272 85.9403 45.5436 86.4567C46.0601 86.9731 46.6741 87.3815 47.3501 87.658C48.026 87.9346 48.7502 88.0737 49.4805 88.0674C50.2108 88.061 50.9325 87.9093 51.6035 87.6211C52.2746 87.3328 52.8815 86.9138 53.3888 86.3885L69.8888 69.8885C70.9203 68.8573 71.5 67.4586 71.5003 66V38.5C71.5003 37.0413 70.9209 35.6424 69.8894 34.6109C68.858 33.5795 67.459 33 66.0003 33C64.5416 33 63.1427 33.5795 62.1112 34.6109C61.0798 35.6424 60.5003 37.0413 60.5003 38.5ZM81.0043 118.932C69.3083 122.228 56.8493 121.552 45.5786 117.01C34.3078 112.468 24.8619 104.316 18.7201 93.8304C12.5784 83.3451 10.0877 71.1189 11.6382 59.0666C13.1887 47.0142 18.6928 35.8165 27.2884 27.2271C35.884 18.6377 47.0857 13.1418 59.1392 11.6C71.1926 10.0583 83.417 12.5578 93.8979 18.7072C104.379 24.8565 112.524 34.3083 117.058 45.5824C121.592 56.8564 122.259 69.3159 118.954 81.0095C118.731 81.7125 118.651 82.4533 118.719 83.1879C118.788 83.9224 119.004 84.6357 119.353 85.2852C119.703 85.9346 120.18 86.5071 120.756 86.9685C121.332 87.4299 121.994 87.7707 122.704 87.9707C123.414 88.1708 124.157 88.2259 124.889 88.1329C125.621 88.0398 126.327 87.8005 126.964 87.4291C127.602 87.0578 128.158 86.562 128.6 85.9712C129.042 85.3805 129.36 84.7069 129.536 83.9905C133.504 69.9478 132.702 54.9855 127.255 41.4477C121.808 27.9099 112.024 16.5614 99.4361 9.17987C86.8482 1.79838 72.1673 -1.19903 57.6933 0.657223C43.2193 2.51347 29.77 9.11851 19.4521 19.4376C9.13426 29.7567 2.53085 43.2069 0.676352 57.6811C-1.17815 72.1553 1.82103 86.8358 9.20404 99.4228C16.5871 112.01 27.9368 121.792 41.4753 127.238C55.0137 132.683 69.9761 133.484 84.0183 129.514C84.7286 129.331 85.3951 129.009 85.9788 128.565C86.5624 128.121 87.0514 127.564 87.417 126.929C87.7825 126.293 88.0172 125.59 88.1073 124.863C88.1973 124.135 88.1409 123.396 87.9414 122.691C87.7419 121.985 87.4032 121.326 86.9454 120.754C86.4876 120.181 85.9198 119.705 85.2755 119.355C84.6312 119.005 83.9234 118.787 83.1936 118.714C82.4639 118.642 81.727 118.716 81.0263 118.932H81.0043Z" fill="#5941A9"/>
                        <circle cx="104" cy="104" r="28" fill="#5941A9"/>
                        </g>
                        <path d="M104 88L104 120" stroke="#010004" strokeWidth="7" strokeLinecap="round"/>
                        <path d="M120 104H88" stroke="#010004" strokeWidth="7" strokeLinecap="round"/>
                        <defs>
                        <clipPath id="clip0_133_53">
                        <rect width="132" height="132" fill="white"/>
                        </clipPath>
                        </defs>
                        </svg>
                      )}
                    
                      
                    </button>
                    <p className={styles.actionText}>Желаемое</p>
                  </div>
                  <div className={styles.actionButtonContainer}>
                    <button 
                    onClick={handleViewContent}
                    >
                      {isViewed === null ? (
                        <p>Загрузка...</p>
                      ) : isViewed ? (
                        <svg className='filled' width="111" height="51" viewBox="0 0 249 188" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M153.442 50.5C153.217 49.9939 146.007 40.0661 133.941 28C117.872 11.9287 99.1602 0 76.8165 0C54.4728 0 35.011 12.9287 18.9415 29C6.87599 41.0662 0.666747 49.9939 0.441522 50.5C0.150413 51.1553 0 51.8644 0 52.5814C0 53.2984 0.150413 54.0075 0.441522 54.6628C0.666747 55.1695 10.8759 67.9357 22.9414 80C39.0108 96.0675 54.4729 105 76.8166 105C99.1603 105 115.372 95.5675 131.441 79.5C143.507 67.4357 153.217 55.1696 153.442 54.6628C153.733 54.0075 153.883 53.2985 153.883 52.5814C153.883 51.8644 153.733 51.1553 153.442 50.5ZM76.8166 29.9379C81.3779 29.9379 85.8368 31.2905 89.6295 33.8246C93.4221 36.3588 96.378 39.9606 98.1236 44.1747C99.8691 48.3889 100.326 53.026 99.436 57.4997C98.5461 61.9733 96.3496 66.0827 93.1243 69.308C89.8989 72.5334 85.7896 74.7299 81.3159 75.6197C76.8422 76.5096 72.2051 76.0529 67.991 74.3074C63.7768 72.5618 60.175 69.6058 57.6408 65.8132C55.1067 62.0206 53.7541 57.5617 53.7541 53.0004C53.761 46.8859 56.193 41.0239 60.5166 36.7003C64.8401 32.3768 70.7022 29.9448 76.8166 29.9379Z" fill="#5941A9"/>
                        <path d="M189.441 39L64.4414 164" stroke="#5941A9" strokeWidth="10" strokeLinecap="round"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M180.64 104.759L177.65 102.643C173.381 99.6222 168.281 98 163.052 98H159.403C156.994 98 154.562 98.1519 152.292 98.9568C138.095 103.992 128.33 122.4 129.036 164.153C129.178 172.566 131.147 181.864 138.737 185.493C141.103 186.625 143.876 187.375 147.034 187.375C150.824 187.375 153.833 186.295 156.156 184.772C158.592 183.176 160.736 181.101 162.88 179.027C165.529 176.464 168.177 173.903 171.371 172.246C174.85 170.442 178.713 169.5 182.632 169.5H194.535C198.454 169.5 202.316 170.442 205.796 172.246C208.99 173.903 211.638 176.464 214.287 179.027C216.431 181.101 218.575 183.176 221.011 184.772C223.334 186.295 226.343 187.375 230.133 187.375C233.29 187.375 236.064 186.625 238.43 185.493C246.02 181.864 247.988 172.566 248.131 164.153C248.837 122.4 239.071 103.992 224.874 98.9568C222.605 98.1519 220.172 98 217.764 98H214.114C208.886 98 203.785 99.6222 199.517 102.643L196.527 104.759C194.204 106.403 191.429 107.286 188.583 107.286C185.738 107.286 182.963 106.403 180.64 104.759ZM216.885 121.833C219.353 121.833 221.354 123.834 221.354 126.302C221.354 128.77 219.353 130.771 216.885 130.771C214.417 130.771 212.417 128.77 212.417 126.302C212.417 123.834 214.417 121.833 216.885 121.833ZM161.771 123.323C164.239 123.323 166.24 125.324 166.24 127.792V132.26H170.708C173.176 132.26 175.177 134.261 175.177 136.729C175.177 139.197 173.176 141.198 170.708 141.198H166.24V145.667C166.24 148.135 164.239 150.135 161.771 150.135C159.303 150.135 157.302 148.135 157.302 145.667V141.198H152.833C150.365 141.198 148.365 139.197 148.365 136.729C148.365 134.261 150.365 132.26 152.833 132.26H157.302V127.792C157.302 125.324 159.303 123.323 161.771 123.323ZM230.292 135.24C230.292 137.708 228.291 139.708 225.823 139.708C223.355 139.708 221.354 137.708 221.354 135.24C221.354 132.772 223.355 130.771 225.823 130.771C228.291 130.771 230.292 132.772 230.292 135.24ZM207.948 139.708C210.416 139.708 212.417 137.708 212.417 135.24C212.417 132.772 210.416 130.771 207.948 130.771C205.48 130.771 203.479 132.772 203.479 135.24C203.479 137.708 205.48 139.708 207.948 139.708ZM221.354 144.177C221.354 141.709 219.353 139.708 216.885 139.708C214.417 139.708 212.417 141.709 212.417 144.177C212.417 146.645 214.417 148.646 216.885 148.646C219.353 148.646 221.354 146.645 221.354 144.177Z" fill="#5941A9"/>
                        </svg>
                      ) : (   
                        <svg className='empty' width="111" height="51" viewBox="0 0 253 193" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M77.5009 0.90625C55.885 0.90625 36.96 13.8498 23.9559 25.8265C17.3494 31.911 12.021 37.9774 8.34459 42.5184C6.5028 44.7928 5.06633 46.6963 4.08208 48.0435C3.58973 48.7175 3.20988 49.2528 2.94847 49.6268C2.81773 49.8138 2.71651 49.9602 2.64561 50.0639L2.56201 50.1862L2.53739 50.2228L0.405273 53.6028L2.52944 56.7655L2.53739 56.7772L2.56201 56.8138L2.64561 56.9361C2.71651 57.0397 2.81773 57.1862 2.94847 57.3732C3.20988 57.7472 3.58973 58.2825 4.08208 58.9565C5.06633 60.3037 6.5028 62.2072 8.34459 64.4816C12.021 69.0226 17.3494 75.0891 23.9559 81.1737C36.96 93.1502 55.885 106.094 77.5009 106.094C99.1166 106.094 118.041 93.1502 131.045 81.1737C137.652 75.0891 142.981 69.0226 146.657 64.4816C148.499 62.2072 149.935 60.3037 150.919 58.9565C151.411 58.2825 151.791 57.7472 152.052 57.3732C152.183 57.1862 152.285 57.0397 152.355 56.9361L152.439 56.8138L152.464 56.7772L152.475 56.7616L154.665 53.5L152.472 50.2345L152.464 50.2228L152.439 50.1862L152.355 50.0639C152.285 49.9602 152.183 49.8138 152.052 49.6268C151.791 49.2528 151.411 48.7175 150.919 48.0435C149.935 46.6963 148.499 44.7928 146.657 42.5184C142.981 37.9774 137.652 31.911 131.045 25.8265C118.041 13.8498 99.1166 0.90625 77.5009 0.90625ZM17.4281 57.1278C16.3109 55.7479 15.3599 54.5215 14.5883 53.5C15.3599 52.4785 16.3109 51.2521 17.4281 49.8722C20.8488 45.6476 25.7899 40.0266 31.8736 34.4235C44.2497 23.0252 60.3872 12.5937 77.5009 12.5937C94.6138 12.5937 110.752 23.0252 123.127 34.4235C129.211 40.0266 134.153 45.6476 137.573 49.8722C138.69 51.2521 139.641 52.4785 140.413 53.5C139.641 54.5215 138.69 55.7479 137.573 57.1278C134.153 61.3524 129.211 66.9733 123.127 72.5763C110.752 83.9748 94.6138 94.4062 77.5009 94.4062C60.3872 94.4062 44.2497 83.9748 31.8736 72.5763C25.7899 66.9733 20.8488 61.3524 17.4281 57.1278ZM95.0314 53.5C95.0314 63.1819 87.1829 71.0312 77.5001 71.0312C67.8182 71.0312 59.9693 63.1819 59.9693 53.5C59.9693 43.8181 67.8182 35.9687 77.5001 35.9687C87.1829 35.9687 95.0314 43.8181 95.0314 53.5ZM106.719 53.5C106.719 69.6373 93.6375 82.7187 77.5001 82.7187C61.3635 82.7187 48.2818 69.6373 48.2818 53.5C48.2818 37.3629 61.3635 24.2812 77.5001 24.2812C93.6375 24.2812 106.719 37.3629 106.719 53.5Z" fill="#5941A9"/>
                        <path d="M230.208 136.073C230.208 138.541 228.207 140.542 225.739 140.542C223.271 140.542 221.271 138.541 221.271 136.073C221.271 133.605 223.271 131.604 225.739 131.604C228.207 131.604 230.208 133.605 230.208 136.073Z" fill="#5941A9"/>
                        <path d="M212.333 136.073C212.333 138.541 210.332 140.542 207.864 140.542C205.396 140.542 203.396 138.541 203.396 136.073C203.396 133.605 205.396 131.604 207.864 131.604C210.332 131.604 212.333 133.605 212.333 136.073Z" fill="#5941A9"/>
                        <path d="M216.802 122.667C219.27 122.667 221.271 124.667 221.271 127.135C221.271 129.603 219.27 131.604 216.802 131.604C214.334 131.604 212.333 129.603 212.333 127.135C212.333 124.667 214.334 122.667 216.802 122.667Z" fill="#5941A9"/>
                        <path d="M216.802 140.542C219.27 140.542 221.271 142.542 221.271 145.01C221.271 147.478 219.27 149.479 216.802 149.479C214.334 149.479 212.333 147.478 212.333 145.01C212.333 142.542 214.334 140.542 216.802 140.542Z" fill="#5941A9"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M150.715 95.5786C153.727 94.5104 156.786 94.3646 159.32 94.3646H162.969C169.123 94.3646 175.125 96.2737 180.148 99.8285L183.138 101.945C184.707 103.054 186.58 103.65 188.5 103.65C190.421 103.65 192.295 103.054 193.862 101.945L196.853 99.8286C201.876 96.2737 207.878 94.3646 214.031 94.3646H217.681C220.215 94.3646 223.274 94.5104 226.285 95.5785C234.885 98.6285 241.686 105.637 246.164 116.977C250.597 128.201 252.874 143.903 252.516 165.062C252.44 169.528 251.883 174.533 250.166 179.041C248.427 183.608 245.387 187.913 240.274 190.358C237.365 191.749 233.937 192.677 230.05 192.677C225.361 192.677 221.504 191.326 218.478 189.343C215.663 187.498 213.202 185.113 211.099 183.075C210.843 182.827 210.592 182.584 210.347 182.348C207.934 180.026 205.906 178.214 203.655 177.047C200.811 175.572 197.655 174.802 194.452 174.802H182.549C179.345 174.802 176.189 175.572 173.345 177.047C171.095 178.214 169.066 180.026 166.654 182.348C166.409 182.584 166.158 182.827 165.902 183.075C163.799 185.113 161.338 187.498 158.523 189.343C155.496 191.326 151.64 192.677 146.951 192.677C143.064 192.677 139.635 191.749 136.726 190.358C131.613 187.913 128.574 183.608 126.834 179.041C125.117 174.533 124.56 169.528 124.485 165.062C124.127 143.904 126.403 128.201 130.836 116.977C135.315 105.637 142.116 98.6285 150.715 95.5786ZM159.32 103.302C157.037 103.302 155.231 103.46 153.703 104.002C148.105 105.987 142.925 110.7 139.149 120.261C135.326 129.938 133.073 144.316 133.421 164.911C133.488 168.858 133.986 172.708 135.187 175.86C136.364 178.952 138.105 181.111 140.582 182.295C142.404 183.166 144.522 183.74 146.951 183.74C149.842 183.74 152.004 182.929 153.623 181.868C155.683 180.518 157.514 178.75 159.714 176.625C159.957 176.39 160.204 176.152 160.456 175.909C162.845 173.609 165.702 170.942 169.231 169.113C173.346 166.978 177.914 165.865 182.549 165.865H194.452C199.087 165.865 203.655 166.978 207.77 169.113C211.299 170.942 214.156 173.609 216.544 175.909C216.797 176.152 217.044 176.39 217.287 176.625C219.486 178.75 221.317 180.518 223.377 181.868C224.997 182.929 227.159 183.74 230.05 183.74C232.479 183.74 234.596 183.166 236.418 182.295C238.896 181.111 240.636 178.952 241.814 175.86C243.014 172.708 243.513 168.858 243.58 164.911C243.928 144.316 241.675 129.938 237.852 120.261C234.076 110.7 228.895 105.987 223.298 104.002C221.77 103.46 219.964 103.302 217.681 103.302H214.031C209.727 103.302 205.529 104.637 202.016 107.124L199.025 109.24C195.948 111.418 192.271 112.588 188.5 112.588C184.73 112.588 181.053 111.418 177.976 109.24L174.985 107.124C171.472 104.637 167.273 103.302 162.969 103.302H159.32ZM161.688 124.156C164.156 124.156 166.157 126.157 166.157 128.625V133.094H170.625C173.093 133.094 175.094 135.095 175.094 137.563C175.094 140.03 173.093 142.031 170.625 142.031H166.157V146.5C166.157 148.968 164.156 150.969 161.688 150.969C159.22 150.969 157.219 148.968 157.219 146.5V142.031H152.75C150.282 142.031 148.282 140.03 148.282 137.563C148.282 135.095 150.282 133.094 152.75 133.094H157.219V128.625C157.219 126.157 159.22 124.156 161.688 124.156Z" fill="#5941A9"/>
                        <path d="M189 40L64 165" stroke="#5941A9" strokeWidth="10" strokeLinecap="round"/>
                        </svg>
                        
                      )}
                    </button>
                    <p className={styles.actionText}>Пройдено</p>
                  </div>
                  <div className={styles.actionButtonContainer}>
                    <button onClick={handleLikeContent} className={styles.actionButton}>
                      <svg
                        width="50px"
                        height="50px"
                        viewBox="0 0 24 24"
                        fill={isLiked === null ? "#010004" : isLiked ? "#5941A9" : "#010004"}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          stroke="#5941A9"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <p className={styles.actionText}>Лайк</p>
                  </div>
                </div>
                <div className={styles.rating}>
                  <h3>Оцените:</h3>
                  <StarRatingInput
                    onSubmit={handleRatingSubmit}
                    onDelete={handleDeleteRating}
                    initialRating={userRating}
                  />
                </div>
                <div className={styles.main}>
                  {/* Кнопка для открытия модального окна */}
                  <button onClick={fetchPlaylists} className={styles.addToPlaylistButton}>
                    Добавить в плейлист
                  </button>

                  
                </div>
                </div>
              </div>
            ) : (
              <div className={styles.sidebar}>
              <div className={styles.guestMessage}>
                <p>
                  Чтобы оценивать и оставлять отзывы, <a href="/register">зарегистрируйтесь</a> или{' '}
                  <a href="/login">войдите</a> в систему.
                </p>
              </div>
              </div>
            )}
            <div className={styles.reviewsBlock}>
              <ReviewComponent userId={userID} contentId={id} />
            </div>
          </div>
        )}
        
      </div>
      <Footer />
    </div>
  );
};

export default ContentPage;

