import Header from '@/components/header/Header';
import styles from './page.module.scss';

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
          </div>
        </div>
        <div className={styles.grid_section}>
          <div className={styles.grid_item}></div>
          <div className={styles.grid_item}></div>
          <div className={styles.grid_item}></div>
          <div className={styles.grid_item}></div>
        </div>
      </div>
    </div>
  );
}
