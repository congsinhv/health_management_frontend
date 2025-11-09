import React from 'react';
import Image from 'next/image';

import styles from './Card.module.scss';

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
      <Image
        src={image}
        alt={description}
        className={styles.card_image}
        width={300}
        height={200}
      />

      <div
        className={`${styles.overlay} ${index === 0 ? styles.custom_block : ''}`}
      ></div>
    </div>
  );
};

export default Card;
