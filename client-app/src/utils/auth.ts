import axios from "axios";

const API_URL = 'http://localhost:5000/auth';

interface Tokens {
  accessToken: string;
}

// Получение accessToken из localStorage
export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Сохранение accessToken в localStorage
export const setAccessToken = (accessToken: string): void => {
  localStorage.setItem('accessToken', accessToken);
};

// Очистка accessToken из localStorage
export const clearAccessToken = (): void => {
  localStorage.removeItem('accessToken');
};

// Запрос на обновление accessToken с использованием refreshToken из куки
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_URL}/refresh-token`, {
      method: 'POST',
      credentials: 'include', // для отправки refresh-токена, который хранится в куки
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const data: Tokens = await response.json();
      setAccessToken(data.accessToken);
      return data.accessToken;
    } else {
      clearAccessToken(); // Очистка accessToken при ошибке обновления
      throw new Error('Unable to refresh access token');
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

// Универсальный fetch запрос с автоматическим обновлением токена при необходимости
export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  let token = getAccessToken();

  const headers = {
    ...options.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}), // Добавляем Authorization только если токен есть
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!localStorage.getItem('accessToken')) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      localStorage.setItem('accessToken', newAccessToken);
      if (newAccessToken) {
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newAccessToken}`,
          },
        });
      }
    }
  }
  // Если токен истёк, пробуем обновить и повторить запрос
  if (response.status === 401) {
    token = await refreshAccessToken();
    if (token) {
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
        },
      });
    }
  }

  return response;
};


export const logout = async (): Promise<void> => {
  try {
    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      credentials: 'include', // Для отправки refresh-токена в куки
    });
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    clearAccessToken(); // Очищаем access-токен из localStorage
    window.location.href = '/login'; // Перенаправляем на страницу входа или домашнюю
  }
};

export const getUserStatus = async (token: string): Promise<string | null> => {
  try {
    const response = await axios.get('http://localhost:5000/auth/user-status', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data?.status || null;
  } catch (error) {
    console.error('Ошибка получения статуса пользователя:', error);
    return null;
  }
};