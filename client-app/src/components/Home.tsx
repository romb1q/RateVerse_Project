import React, { useEffect, useState } from 'react';
import { getUserRole, getUserName } from '../utils/fetchUserRole';
import { useNavigate } from 'react-router-dom';

import styles from '../styles/Home.module.scss';
import Header from './Header';
import Footer from './Footer';

const Home: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUserRole = async () => {
      const userRole = await getUserRole();
      setRole(userRole || 'guest');
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchUserName = async () => {
      const userName = await getUserName();
      setName(userName || 'User');
    };
    fetchUserName();
  }, []);

  if (role === null) return <p>Loading...</p>;

  

  const handleMoviesPage = () => {
    navigate('/movies'); 
  };

  const handleSerialsPage = () => {
    navigate('/serials'); 
  };

  const handleGamesPage = () => {
    navigate('/games'); 
  };

  return (
    <div className={styles.home}>
      <Header/>

      <div className={styles.welcomeText}>
      <h1 className={styles.welcomeH1}>Добро пожаловать{name !== 'User' ? `, ${name}` : '!'}!</h1>
      {role === 'guest' && <GuestOptions />}
      {role === 'user' && <UserOptions />}
      {role === 'admin' && <AdminOptions />}
      </div>
      <div className={styles.categoriesContainer}>
      <div className={styles.categoryCard} onClick={handleMoviesPage}>
        <div className={styles.overlay}>
          <p>Фильмы</p>
        </div>
      </div>
      <div className={styles.categoryCard} onClick={handleSerialsPage}>
        <div className={styles.overlay}>
          <p>Сериалы</p>
        </div>
      </div>
      <div className={styles.categoryCard} onClick={handleGamesPage}>
        <div className={styles.overlay}>
          <p>Игры</p>
        </div>
      </div>
    </div>
    {/*<h1 className={styles.welcomeH1}>Добро пожаловать{name !== 'User' ? `, ${name}` : '!'}!</h1>*/}

    {role !== 'guest' && (
      <div className={styles.analyticsRecommendations}>
        <div className={styles.card} onClick={() => navigate('/recommendations')}>
          <div className={styles.overlay}>
            <svg width="80px" height="80px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.16923 2.00234C8.11301 2.00078 8.0566 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 7.9434 13.9992 7.88699 13.9977 7.83077L15.7642 6.06422C15.9182 6.68407 16 7.33249 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C8.66751 0 9.31593 0.0817526 9.93578 0.235791L8.16923 2.00234Z" fill="#5941A9"/>
              <path d="M4 7.99996C4 6.13612 5.27477 4.57002 7 4.12598V6.26752C6.4022 6.61333 6 7.25968 6 7.99996C6 9.10453 6.89543 9.99996 8 9.99996C8.74028 9.99996 9.38663 9.59776 9.73244 8.99996H11.874C11.4299 10.7252 9.86384 12 8 12C5.79086 12 4 10.2091 4 7.99996Z" fill="#5941A9"/>
              <path d="M14 2L13 0L10 3V4.58579L7.79289 6.79289L9.20711 8.20711L11.4142 6H13L16 3L14 2Z" fill="#5941A9"/>
            </svg>
            <h3>Рекомендации</h3>
            <p>Уникальные предложения на основе ваших предпочтений</p>
          </div>
        </div>
        <div className={styles.card} onClick={() => navigate('/activity')}>
          <div className={styles.overlay}>
            <svg width="80px" height="80px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M2.87868 2.87868C2 3.75736 2 5.17157 2 8V16C2 18.8284 2 20.2426 2.87868 21.1213C3.75736 22 5.17157 22 8 22H16C18.8284 22 20.2426 22 21.1213 21.1213C22 20.2426 22 18.8284 22 16V8C22 5.17157 22 3.75736 21.1213 2.87868C20.2426 2 18.8284 2 16 2H8C5.17157 2 3.75736 2 2.87868 2.87868ZM17.8321 9.5547C18.1384 9.09517 18.0142 8.4743 17.5547 8.16795C17.0952 7.8616 16.4743 7.98577 16.1679 8.4453L13.1238 13.0115L12.6651 12.094C11.9783 10.7205 10.0639 10.6013 9.2121 11.8791L6.16795 16.4453C5.8616 16.9048 5.98577 17.5257 6.4453 17.8321C6.90483 18.1384 7.5257 18.0142 7.83205 17.5547L10.8762 12.9885L11.3349 13.906C12.0217 15.2795 13.9361 15.3987 14.7879 14.1209L17.8321 9.5547Z" fill="#5941A9"/>
            </svg>
            <h3>Активность</h3>
            <p>Оценки, лайки и история просмотров — всё в одном месте</p>
          </div>
        </div>
      </div>
    )}

    <Footer/>
    </div>
  );
};

const GuestOptions: React.FC = () => {
  return <p>Пройдите регистрацию для использования всего функционала сайта.</p>;
};

const UserOptions: React.FC = () => {
  return <p>Оценивайте, оставляйте отзывы и составляйте плейлисты из сотен фильмов игр или сериалов!</p>;
};

const AdminOptions: React.FC = () => {
  return <p>Вы имеете доступ к панели администратора. 
  </p>;
};

export default Home;
