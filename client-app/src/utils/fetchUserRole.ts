//import { toast } from 'react-toastify';
import { fetchWithAuth } from './auth';

export const getUserRole = async () => {
  try {
    const response = await fetchWithAuth(`http://localhost:5000/auth/user-role`);
    if (response.ok) {
      const data = await response.json();
      return data.role || 'guest'; // Если сервер вернул null, интерпретируем как guest
    } else {
      console.error('Failed to fetch user role');
      return 'guest';
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
    return 'guest';
  }
};

export const getUserName = async () => {
  try {
    const response = await fetchWithAuth(`http://localhost:5000/auth/user-name`);
    if (response.ok) {
      const data = await response.json();
      return data.name || 'User'; // Если сервер вернул null, устанавливаем 'User'
    } else {
      console.error('Failed to fetch user name');
      return 'User';
    }
  } catch (error) {
    console.error('Error fetching user name:', error);
    return 'User';
  }
};



export const getUserId = async () => {
  try {
    const response = await fetchWithAuth(`http://localhost:5000/auth/user-id`);
    if (response.ok) {
      const data = await response.json();
      return data.id || '0'; // Если сервер вернул null, интерпретируем как ID гостя
    } else {
      console.error('Failed to fetch user id');
      return '0';
    }
  } catch (error) {
    console.error('Error fetching user id:', error);
    return '0';
  }
};


