import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setAccessToken } from '../utils/auth';
import { getUserStatus } from '../utils/auth';
import styles from '../styles/SignIn.module.scss';

const SignIn: React.FC = () => {
  const [UserName, setUserName] = useState('');
  const [UserPassword, setUserPassword] = useState('');
  const [errors, setErrors] = useState({ UserName: '', UserPassword: '' });
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { UserName: '', UserPassword: '' };

    if (UserName.length < 3) {
      newErrors.UserName = 'Имя пользователя должно содержать не менее 3 символов';
      isValid = false;
    } else if (!/^[a-zA-Z]+$/.test(UserName)) {
      newErrors.UserName = 'Имя пользователя должно содержать только латинские буквы без пробелов';
      isValid = false;
    }

    if (UserPassword.length < 6) {
      newErrors.UserPassword = 'Пароль должен содержать не менее 6 символов';
      isValid = false;
    } else if (/[\s]/.test(UserPassword)) {
      newErrors.UserPassword = 'Пароль не должен содержать пробелов';
      isValid = false;
    } else if (/[^a-zA-Z0-9]/.test(UserPassword)) {
      newErrors.UserPassword = 'Пароль должен содержать только латинские буквы и цифры';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ UserName, UserPassword }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data);

        // Проверяем статус пользователя
        const status = await getUserStatus(data.accessToken);
        if (status === 'active') {
          toast.success('Вы успешно вошли в систему');
          navigate('/home');
        } else if (status === 'blocked') {
          navigate('/blocked');
        } else {
          toast.error('Неизвестный статус пользователя.');
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Ошибка входа');
      }
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      toast.error('Ошибка авторизации');
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
        <svg width="90" height="90" viewBox="0 0 216 216" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6 108C6 24.003 24.003 6 108 6C191.997 6 210 24.003 210 108C210 191.997 191.997 210 108 210C24.003 210 6 191.997 6 108Z"
          fill="#5941A9"
          stroke="#5941A9"
          strokeWidth="11"
        />
        <path
          d="M104.439 61.6999C105.794 59.1298 106.471 57.8447 107.375 57.4252C108.163 57.0598 109.072 57.0598 109.86 57.4252C110.765 57.8447 111.442 59.1298 112.796 61.6999L121.104 77.4618C121.689 78.5715 121.982 79.1263 122.417 79.4957C122.802 79.8219 123.263 80.0441 123.758 80.1413C124.318 80.2515 124.934 80.1342 126.167 79.8996L143.67 76.5676C146.523 76.0243 147.951 75.7527 148.843 76.1983C149.62 76.5864 150.186 77.2969 150.391 78.1407C150.628 79.1095 150.045 80.4402 148.881 83.1017L141.737 99.4246C141.234 100.574 140.983 101.148 140.965 101.719C140.95 102.223 141.064 102.722 141.297 103.17C141.56 103.677 142.036 104.085 142.988 104.902L156.506 116.51C158.71 118.402 159.812 119.348 160.019 120.323C160.201 121.173 159.998 122.059 159.467 122.745C158.856 123.534 157.453 123.909 154.646 124.657L137.43 129.249C136.218 129.573 135.612 129.735 135.155 130.077C134.752 130.379 134.433 130.78 134.228 131.24C133.996 131.762 133.973 132.389 133.927 133.642L133.281 151.448C133.176 154.351 133.123 155.803 132.49 156.573C131.939 157.245 131.12 157.639 130.252 157.651C129.254 157.666 128.087 156.802 125.751 155.074L111.427 144.478C110.419 143.732 109.914 143.359 109.362 143.215C108.874 143.088 108.362 143.088 107.874 143.215C107.321 143.359 106.817 143.732 105.808 144.478L91.4844 155.074C89.1488 156.802 87.981 157.666 86.984 157.651C86.1157 157.639 85.2969 157.245 84.7456 156.573C84.1126 155.803 84.06 154.351 83.9546 151.448L83.3082 133.642C83.2627 132.389 83.24 131.762 83.0079 131.24C82.8031 130.78 82.4837 130.379 82.0801 130.077C81.623 129.735 81.0171 129.573 79.8051 129.249L62.5896 124.657C59.7826 123.909 58.3791 123.534 57.7688 122.745C57.2372 122.059 57.035 121.173 57.2159 120.323C57.4237 119.348 58.5257 118.402 60.7299 116.51L74.248 104.902C75.1997 104.085 75.6755 103.677 75.9388 103.17C76.1712 102.722 76.2852 102.223 76.2699 101.719C76.2526 101.148 76.0012 100.574 75.4983 99.4246L68.355 83.1017C67.1902 80.4402 66.6079 79.1095 66.8439 78.1407C67.0494 77.2969 67.616 76.5864 68.3929 76.1983C69.2848 75.7527 70.7118 76.0243 73.5658 76.5676L91.0689 79.8996C92.3011 80.1342 92.9172 80.2515 93.4775 80.1413C93.9723 80.0441 94.4339 79.8219 94.8183 79.4957C95.2538 79.1263 95.5462 78.5715 96.131 77.4618L104.439 61.6999Z"
          fill="#FFF8F0"
          stroke="#FFF8F0"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p><span>Rate</span>Verse</p>
        </div>
      </div>
      <div className={styles.signwindow}>
        <div>
          <h2 className={styles.signtitle}>Вход</h2>
          <form className={styles.signform} onSubmit={handleSignIn}>
            <input
              type='text'
              value={UserName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder='Имя'
              className={styles.inputField}
              required
            />
            {errors.UserName && <p className={styles.errorText}>{errors.UserName}</p>}
            <input
              type='password'
              value={UserPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              placeholder='Пароль'
              className={styles.inputField}
              required
            />
            {errors.UserPassword && <p className={styles.errorText}>{errors.UserPassword}</p>}
            <button className={styles.signbutton} type='submit'>
              Войти
            </button>
          </form>
          <div className={styles.reservecase}>
            <p>
              Нет аккаунта? <Link to='/register'>Зарегистрироваться</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
