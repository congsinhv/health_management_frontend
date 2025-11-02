import React from 'react';
import styles from './InforSection.module.scss';

const images = [
  'https://plus.unsplash.com/premium_photo-1709077628025-4cb21667cc48?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987',
  'https://images.unsplash.com/photo-1734515515416-21bbe9f35775?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070',
  'https://images.unsplash.com/photo-1718793834155-ba3bd687b04a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1017',
];

const InforSection = () => {
  return (
    <section className={styles.infor}>
      <div className={styles.infor_images}>
        {images.map((src, index) => (
          <div className={styles.infor_imageWrapper} key={index}>
            <img
              src={src}
              alt={`infor lifestyle ${index + 1}`}
              className={styles.infor_image}
            />
          </div>
        ))}
      </div>

      <div className={styles.infor_content}>
        <h2 className={styles.infor_title}>Sống Khỏe Mỗi Ngày</h2>
        <p className={styles.infor_description}>
          Nền tảng sử dụng thuật toán học máy đã thẩm định nội bộ, hiệu năng đo
          bằng AUC/F1 (≥ ghi số thực tế của bạn) và được đối chiếu bởi đội ngũ
          chuyên môn. Chúng tôi khuyến cáo người dùng kiểm tra định kỳ các chỉ
          số BMI, vòng eo, huyết áp và thói quen ăn–tập để giảm rủi ro thừa
          cân/béo phì và bệnh chuyển hóa. Dữ liệu được ẩn danh & mã hóa theo
          tiêu chuẩn ngành. <br />
          <span className={styles.infor_note}>
            * Tham khảo bác sĩ khi có bất kỳ dấu hiệu bất thường.
          </span>
        </p>
      </div>
    </section>
  );
};

export default InforSection;
