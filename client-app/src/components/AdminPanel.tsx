import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import UsersAdminPanel from './UsersAdminPanel';
import ContentAdminPanel from './ContentAdminPanel';
import styles from "../styles/MoviesPage.module.scss";

const AdminPanel: React.FC = () => {
  return (
    <div className="admin-panel">
      <h1>Панель Администратора</h1> 
      <Link to="/home">
          <button>На главную</button>
        </Link>
      <div className={styles.navbar}>
        <Link to="/admin/users">
          <button>Пользователи</button>
        </Link>
        <Link to="/admin/content">
          <button>Контент</button>
        </Link>
      </div>
      <div className={styles.panelContent}>
        <Routes>
          <Route path="/users" element={<UsersAdminPanel />} />
          <Route path="/content" element={<ContentAdminPanel />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
