import React from 'react';

import styles from './Card.module.scss';
import FeedbackIcon from '../icons/feedback';

interface CardProps {
  id: number;
  index: number;
  description: string;
  image: string;
}

const Card = ({ description, image, index }: CardProps) => {
  return (
    <div className={styles.card}>
      {index !== 1 && (
        <p className={styles.card_header_description}>{description}</p>
      )}
      <img src={image} alt={description} className={styles.card_image} />
      {index !== 1 && (
        <div
          className={`${styles.overlay} ${index === 0 ? styles.custom_block : ''}`}
        ></div>
      )}
    </div>
  );
};

export default Card;
