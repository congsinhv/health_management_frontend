import React from 'react';
import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__copyright}>
        © 2025 Copyright by TruLem. All images are for demo purposes only.
      </div>
    </footer>
  );
};

export default Footer;
