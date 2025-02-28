import React from 'react';
import styles from '../styles/Home.module.scss';

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
  <div className={styles.footerContent}>
    <p>&copy; 2024 RateVerse. Все права защищены.</p>
    <div className={styles.socialLinks}>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
    </div>
  </div>
</footer>
      );
    };
    export default Footer;