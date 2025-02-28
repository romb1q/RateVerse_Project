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
