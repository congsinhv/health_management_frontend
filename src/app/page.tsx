'use client';

import Header from '@/components/header/Header';
import styles from './page.module.scss';
import Button from '@/components/button/Button';
import Star from '@/components/icons/star';
import Card from '@/components/card/Card';

const gridData = [
  {
    id: 1,
    image: '/healthcare-image1.png',
    description:
      'Lorem Ipsum is simply  dummy  text of the printing and typesetting industry',
  },
  {
    id: 2,
    image: '/healthcare_image2.png',
    description:
      'Lorem Ipsum is simply  dummy  text of the printing and typesetting industry',
  },
  {
    id: 3,
    image: '/healthcare_image3.png',
    description:
      'Lorem Ipsum is simply  dummy  text of the printing and typesetting industry',
  },
];

const handleChat = () => {
  console.log('Chat ngay');
};

export default function LandingPage() {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className={styles.container}>
        <div className={styles.hero_section}>
          <div className={styles.hero_section_content}>
            <h1 className={styles.hero_section_content_title}>
              Kiểm Soát Cân Nặng <br /> Ăn Lành Mạnh
            </h1>
            <p className={styles.hero_section_content_description}>
              Trò chuyện trực tiếp với trợ lý sức khỏe, nhận gợi ý chế độ ăn cá
              nhân hoá và dự đoán nguy cơ thừa cân, béo phì
            </p>
            <Button
              text='Dự đoán sức khỏe ngay'
              onClick={handleChat}
              isPrimary
              showIcon
              icon={<Star />}
            />
          </div>
        </div>
        <div className={styles.grid_section}>
          {gridData.slice(0, 2).map((item, index) => (
            <Card
              index={index}
              key={index}
              id={item.id}
              image={item.image}
              description={item.description}
            />
          ))}
          <div className={styles.custom_block}>
            <div className={styles.custom_block_content}>
              <h3>Lorem Ipsum is simply </h3>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry
              </p>
              <div className={styles.custom_block_content_decorates}>
                <img src='/icons/Decorate1.svg' alt='Custom Content Block 1' />
                <img src='/icons/Decorate2.svg' alt='Custom Content Block 2' />
              </div>
            </div>
            <div className='flex w-full flex-row justify-between'>
              <div className={styles.custom_block_icons}>
                <img src='/Avatar1.png' alt='Custom Content Block 4' />
                <img src='/Avatar2.png' alt='Custom Content Block 5' />
              </div>
              <img
                className={styles.custom_block_icons_feedback}
                src='/icons/Feedback.svg'
                alt='Custom Content Block 6'
              />
            </div>
          </div>
          {/* Fourth position - Last item from gridData */}
          <Card
            index={2}
            key={2}
            id={gridData[2].id}
            image={gridData[2].image}
            description={gridData[2].description}
          />
        </div>
      </div>
    </div>
  );
}
