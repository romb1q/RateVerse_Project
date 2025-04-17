import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "../styles/MoviesPage.module.scss";

interface User {
  UserID: number;
  UserName: string;
  UserStatus: string;
}

const UsersAdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
  });

  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<User[]>('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Ошибка при загрузке пользователей:', err);
      setError('Не удалось загрузить пользователей.');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: number, newStatus: string) => {
    try {
      await apiClient.put(`/users/${userId}`, { UserStatus: newStatus });
      alert(`Статус пользователя успешно обновлён на ${newStatus}`);
      fetchUsers();
    } catch (err) {
      console.error('Ошибка при обновлении статуса пользователя:', err);
      alert('Не удалось обновить статус пользователя.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className={styles.usersPanel}>
      <h1>Users Admin Panel</h1>

      {loading ? (
        <p>Загрузка...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4}>Нет пользователей для отображения.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.UserID}>
                  <td>{user.UserID}</td>
                  <td>{user.UserName}</td>
                  <td>{user.UserStatus}</td>
                  <td>
                    {user.UserStatus === 'active' ? (
                      <button onClick={() => updateUserStatus(user.UserID, 'blocked')}>
                        Заблокировать
                      </button>
                    ) : (
                      <button onClick={() => updateUserStatus(user.UserID, 'active')}>
                        Активировать
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersAdminPanel;
