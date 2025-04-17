import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useCheckUserStatus = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/users/status', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status === 'blocked') {
          navigate('/blocked');
        }
      } catch (error) {
        console.error('Ошибка проверки статуса пользователя:', error);
        navigate('/login');
      }
    };

    checkStatus();
  }, [navigate]);
};

export default useCheckUserStatus;
