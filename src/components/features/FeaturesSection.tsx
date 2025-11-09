import React from 'react';
import styles from './FeaturesSection.module.scss';
import Button from '../button/Button';
import Star from '@/components/icons/star';

type FeatureCard = {
  title: string;
  description: string;
  linkText: string;
  isHighlight?: boolean;
  href?: string;
};

const features: FeatureCard[] = [
  {
    title: 'Dự đoán nguy cơ thừa cân/béo phì',
    description:
      'AI phân tích tuổi, giới, số đo và thói quen để ước tính nguy cơ trong 3–12 tháng tới.',
    linkText: 'Dự đoán ngay',
    href: './chatbox',
  },
  {
    title: 'Đề xuất chế độ ăn uống & tập luyện',
    description:
      'Kế hoạch, thực đơn theo mục tiêu cùng lịch tập theo tuần, thời lượng, cường độ phù hợp.',
    linkText: 'Xem kế hoạch mẫu',
    isHighlight: true,
  },
  {
    title: 'Chatbot hỗ trợ sức khoẻ',
    description:
      'Trợ lý 24/7 trả lời về dinh dưỡng, luyện tập, theo dõi thói quen và nhắc lịch—hiểu câu hỏi tiếng Việt tự nhiên.',
    linkText: 'Chat ngay',
  },
];

const FeaturesSection = () => {
  const handleChat = () => {
    console.log('Chat ngay');
  };

  return (
    <section className={styles.features_section}>
      <div className={styles.features_container}>
        <div className={styles.features_header}>
          <Button
            text='Dự đoán sức khỏe ngay'
            onClick={handleChat}
            showIcon
            icon={<Star />}
          />
          <h2 className={styles.features_title}>
            Dự Đoán Nguy Cơ Ăn Uống Khoa Học
          </h2>
          <p className={styles.features_description}>
            Công cụ AI giúp bạn kiểm soát cân nặng qua ba tính năng: dự đoán
            nguy cơ, kế hoạch ăn–tập cá nhân hoá và trợ lý sức khoẻ 24/7.
          </p>
        </div>

        <div className={styles.features_cards}>
          {features.map((item, index) => (
            <div
              key={index}
              className={`${styles.card} ${item.isHighlight ? styles.highlight : ''}`}
            >
              <div className={styles.card_icon}>
                <span>💬</span>
              </div>
              <h3 className={styles.card_title}>{item.title}</h3>
              <p className={styles.card_description}>{item.description}</p>
              <a href={item.href} className={styles.card_link}>
                {item.linkText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
