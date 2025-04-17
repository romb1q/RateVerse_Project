import axios from "axios";

const API_URL = 'http://localhost:5000/auth';

interface Tokens {
  accessToken: string;
}

export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const setAccessToken = (accessToken: string): void => {
  localStorage.setItem('accessToken', accessToken);
};

export const clearAccessToken = (): void => {
  localStorage.removeItem('accessToken');
};

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_URL}/refresh-token`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const data: Tokens = await response.json();
      setAccessToken(data.accessToken);
      return data.accessToken;
    } else {
      clearAccessToken(); 
      throw new Error('Unable to refresh access token');
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  let token = getAccessToken();

  const headers = {
    ...options.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
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
      credentials: 'include',
    });
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    clearAccessToken();
    window.location.href = '/login'; 
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