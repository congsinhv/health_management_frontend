import React from 'react';
import styles from './NumberSection.module.scss';

type NumberCard = {
  value: string;
  description: string;
};

const number: NumberCard[] = [
  {
    value: '+20%',
    description: 'Cải thiện tuần thủ mục tiêu ăn uống & vận động',
  },
  {
    value: '3',
    description: 'Cảnh báo nguy cơ từ thấp → cao, dễ hiểu',
  },
  {
    value: '24/7',
    description: 'Hỗ trợ & theo dõi qua web và di động',
  },
];

const NumberSection = () => {
  return (
    <section className={styles.number_section}>
      <div className={styles.number_container}>
        {number.map((item, index) => (
          <div className={styles.number_card} key={index}>
            <h2 className={styles.number_value}>{item.value}</h2>
            <p className={styles.number_description}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NumberSection;
