'use client';

import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
  text: string;
  onClick: () => void;
  showIcon?: boolean;
  icon?: React.ReactNode;
  isPrimary?: boolean;
  className?: string;
}

const Button = ({
  text,
  onClick,
  showIcon,
  icon,
  isPrimary,
  className,
}: ButtonProps) => {
  return (
    <div
      className={
        styles.button +
        ' ' +
        (className ? className : '') +
        (isPrimary ? styles.primary : '')
      }
      onClick={onClick}
    >
      {showIcon && icon && <span className={styles.button_icon}>{icon}</span>}
      <span className={styles.button_text}>{text}</span>
    </div>
  );
};

export default Button;
