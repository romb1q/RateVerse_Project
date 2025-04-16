import React, { useEffect, useState, useRef } from 'react';
import { getUserRole, getUserName } from '../utils/fetchUserRole';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import styles from '../styles/Home.module.scss';

const Header: React.FC = () => {
    const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const navigate = useNavigate();

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

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

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (role === null) return <p>Loading...</p>;

  const handleHome = async () => {
    navigate('/home');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  const handleLogin = () => {
    navigate('/register'); 
  };
  const handleAdminPanel = () => {
    navigate('/admin'); 
  };
    return (
<header className={styles.header}>
        <div className={styles.logo} onClick={handleHome}>
        <svg width="50" height="50" viewBox="0 0 216 216" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6 108C6 24.003 24.003 6 108 6C191.997 6 210 24.003 210 108C210 191.997 191.997 210 108 210C24.003 210 6 191.997 6 108Z" fill="#5941A9" stroke="#5941A9" strokeWidth="11"/>
<path d="M104.439 61.6999C105.794 59.1298 106.471 57.8447 107.375 57.4252C108.163 57.0598 109.072 57.0598 109.86 57.4252C110.765 57.8447 111.442 59.1298 112.796 61.6999L121.104 77.4618C121.689 78.5715 121.982 79.1263 122.417 79.4957C122.802 79.8219 123.263 80.0441 123.758 80.1413C124.318 80.2515 124.934 80.1342 126.167 79.8996L143.67 76.5676C146.523 76.0243 147.951 75.7527 148.843 76.1983C149.62 76.5864 150.186 77.2969 150.391 78.1407C150.628 79.1095 150.045 80.4402 148.881 83.1017L141.737 99.4246C141.234 100.574 140.983 101.148 140.965 101.719C140.95 102.223 141.064 102.722 141.297 103.17C141.56 103.677 142.036 104.085 142.988 104.902L156.506 116.51C158.71 118.402 159.812 119.348 160.019 120.323C160.201 121.173 159.998 122.059 159.467 122.745C158.856 123.534 157.453 123.909 154.646 124.657L137.43 129.249C136.218 129.573 135.612 129.735 135.155 130.077C134.752 130.379 134.433 130.78 134.228 131.24C133.996 131.762 133.973 132.389 133.927 133.642L133.281 151.448C133.176 154.351 133.123 155.803 132.49 156.573C131.939 157.245 131.12 157.639 130.252 157.651C129.254 157.666 128.087 156.802 125.751 155.074L111.427 144.478C110.419 143.732 109.914 143.359 109.362 143.215C108.874 143.088 108.362 143.088 107.874 143.215C107.321 143.359 106.817 143.732 105.808 144.478L91.4844 155.074C89.1488 156.802 87.981 157.666 86.984 157.651C86.1157 157.639 85.2969 157.245 84.7456 156.573C84.1126 155.803 84.06 154.351 83.9546 151.448L83.3082 133.642C83.2627 132.389 83.24 131.762 83.0079 131.24C82.8031 130.78 82.4837 130.379 82.0801 130.077C81.623 129.735 81.0171 129.573 79.8051 129.249L62.5896 124.657C59.7826 123.909 58.3791 123.534 57.7688 122.745C57.2372 122.059 57.035 121.173 57.2159 120.323C57.4237 119.348 58.5257 118.402 60.7299 116.51L74.248 104.902C75.1997 104.085 75.6755 103.677 75.9388 103.17C76.1712 102.722 76.2852 102.223 76.2699 101.719C76.2526 101.148 76.0012 100.574 75.4983 99.4246L68.355 83.1017C67.1902 80.4402 66.6079 79.1095 66.8439 78.1407C67.0494 77.2969 67.616 76.5864 68.3929 76.1983C69.2848 75.7527 70.7118 76.0243 73.5658 76.5676L91.0689 79.8996C92.3011 80.1342 92.9172 80.2515 93.4775 80.1413C93.9723 80.0441 94.4339 79.8219 94.8183 79.4957C95.2538 79.1263 95.5462 78.5715 96.131 77.4618L104.439 61.6999Z" fill="#FFF8F0" stroke="#FFF8F0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
          <p><span>Rate</span>Verse</p>
        </div>
        
        <div className={styles.userInfo}>
          {role === 'guest' ? (
            <button className={styles.registerButton} onClick={handleLogin}>Регистрация</button>
          ) : (
            <>
              
              <svg width="45" height="45" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27 49.5C39.4263 49.5 49.5 39.4263 49.5 27C49.5 14.5736 39.4263 4.5 27 4.5C14.5736 4.5 4.5 14.5736 4.5 27C4.5 39.4263 14.5736 49.5 27 49.5Z" fill="#FFF8F0" stroke="#FFF8F0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M27.2702 26.755C27.1127 26.7325 26.9102 26.7325 26.7302 26.755C22.7702 26.62 19.6201 23.38 19.6201 19.3975C19.6201 15.325 22.9052 12.0175 27.0002 12.0175C31.0727 12.0175 34.3802 15.325 34.3802 19.3975C34.3577 23.38 31.2302 26.62 27.2702 26.755Z" fill="#010004" stroke="#010004" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M42.1649 43.6052C38.1599 47.2727 32.8499 49.5002 26.9999 49.5002C21.15 49.5002 15.84 47.2727 11.835 43.6052C12.06 41.4902 13.41 39.4202 15.8175 37.8002C21.9825 33.7052 32.0624 33.7052 38.1824 37.8002C40.5899 39.4202 41.9399 41.4902 42.1649 43.6052Z" fill="#010004" stroke="#010004" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>


              
              <span 
                className={styles.username} 
                onClick={toggleDropdown}
              >
                {name}
              </span>

             
              <svg 
                width="11" 
                height="9" 
                viewBox="0 0 20 18" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                onClick={toggleDropdown}
                className={isDropdownOpen ? styles.rotate : ''} 
              >
                <path d="M11.3856 15.6L11.3856 15.6L18.1406 3.9C18.7565 2.83333 17.9867 1.5 16.755 1.5L3.245 1.5C2.01332 1.5 1.24353 2.83333 1.85935 3.89999L3.1002 3.1836L1.85936 3.9L8.61435 15.6C8.61436 15.6 8.61436 15.6 8.61436 15.6C9.23021 16.6667 10.7698 16.6667 11.3856 15.6Z" fill="#FFF8F0" stroke="#FFF8F0" strokeWidth="3"/>
              </svg>
              
              {isDropdownOpen && (
                <div className={styles.dropdownMenu} ref={dropdownRef}>
                  <button onClick={handleLogout} className={styles.logoutButton}>
                    Выйти
                  </button>
                  <button className={styles.logoutButton}>
                    <Link 
                      className={styles.buttonLink} 
                      to="/watchlist">
                        Желаемое
                    </Link>
                  </button>
                  <button className={styles.logoutButton}>
                    <Link 
                      className={styles.buttonLink} 
                      to="/likes">
                        Лайки
                    </Link>
                  </button>
                  <button className={styles.logoutButton}>
                    <Link 
                      className={styles.buttonLink} 
                      to="/playlists">
                        Плейлисты
                    </Link>
                  </button>
                  <button className={styles.logoutButton}>
                    <Link 
                      className={styles.buttonLink} 
                      to="/activity">
                        Активность
                    </Link>
                  </button>
                  {role === 'admin' ? (
                    <button onClick={handleAdminPanel} className={styles.logoutButton}>
                    AdminPanel
                  </button>): ('')}
                </div>
              )}
            </>
          )}
        </div>
      </header>
      );
    };
    export default Header;