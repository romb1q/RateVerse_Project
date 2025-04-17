import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ContentType } from '../utils/types';
import styles from '../styles/Recommendations.module.scss';
import Header from './Header';
import { useNavigate } from 'react-router';

const Recommendations: React.FC = () => {
  const [movieRecs, setMovieRecs] = useState<ContentType[]>([]);
  const [serialRecs, setSerialRecs] = useState<ContentType[]>([]);
  const [gameRecs, setGameRecs] = useState<ContentType[]>([]);
  const [activeTab, setActiveTab] = useState<'movie' | 'serial' | 'game'>('movie');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get('http://localhost:5000/api/recomendations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMovieRecs(res.data.movie);
        setSerialRecs(res.data.serial);
        setGameRecs(res.data.game);
      } catch (err) {
        console.error('Ошибка при получении рекомендаций', err);
      }
    };

    fetchRecommendations();
  }, []);

  const renderContent = (list: ContentType[]) => {
    if (list.length === 0) {
      return <p className={styles.emptyMessage}>Нет рекомендаций</p>;
    }

    return (
      <div className={styles.grid}>
        {list.map((content) => (
          <div key={content.ContentID} className={styles.card} onClick={() => navigate(`/content/${content.ContentID}`)}>
            <img src={content.ContentImage} alt={content.ContentName} />
            <div className={styles.cardInfo}>
              <h4>{content.ContentName}</h4>
              <p>{content.ContentGenre}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
        <Header />
    <section className={styles.wrapper}>
      <h2>Рекомендации для вас</h2>
      <div className={styles.tabs}>
        <button onClick={() => setActiveTab('movie')} className={activeTab === 'movie' ? styles.active : ''}>Фильмы</button>
        <button onClick={() => setActiveTab('serial')} className={activeTab === 'serial' ? styles.active : ''}>Сериалы</button>
        <button onClick={() => setActiveTab('game')} className={activeTab === 'game' ? styles.active : ''}>Игры</button>
      </div>
      <div className={styles.tabContent}>
        {activeTab === 'movie' && renderContent(movieRecs)}
        {activeTab === 'serial' && renderContent(serialRecs)}
        {activeTab === 'game' && renderContent(gameRecs)}
      </div>
    </section>
    </div>
  );
};

export default Recommendations;
