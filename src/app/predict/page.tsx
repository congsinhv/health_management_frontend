'use client';

import React from 'react';
import styles from './page.module.scss';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import Textfield from '@/components/field/Textfield';
import {
  alcoholOptions,
  genderOptions,
  physicalActivityOptions,
  screenTimeOptions,
  snackOptions,
  transportationOptions,
  vegetableOptions,
  waterIntakeOptions,
  yesNoOptions,
} from './formHelper';
import Dropdown from '@/components/dropdown/Dropdown';
import Ratiofield from '@/components/ratio/Ratiofield';

const PredictPage = () => {
  return (
    <>
      <Header className={styles.predict_top} />
      <div className={styles.predict_page}>
        <div className={styles.predict_header}>
          <div className={styles.predict_header_container}>
            <h1>Điền biểu mẫu sau để dự đoán sức khoẻ</h1>
            <p>
              Trò chuyện trực tiếp với trợ lý sức khỏe, nhận gợi ý chế độ ăn cá
              nhân hoá và dự đoán nguy cơ thừa cân, béo phì Lorem Ipsum is
              simply dummy text of the printing and typesetting industry. Lorem
              Ipsum has been the industry's standard dummy text ever since the
              1500s
            </p>
          </div>
        </div>
        <div className={styles.predict_content}>
          <div className={styles.form_wrapper}>
            {/* Demographics */}
            <section className={styles.section}>
              <h2 className={styles.section_title}>Thông tin nhân khẩu học</h2>
              <div className={styles.grid_two}>
                <Textfield
                  label='Tên người dùng'
                  placeholder='VD: Nguyễn Văn A'
                  value=''
                  onChange={() => {}}
                />
                <Dropdown
                  label='Giới tính'
                  placeholder='Chọn giới tính'
                  value=''
                  onChange={() => {}}
                  options={genderOptions}
                />

                <Textfield
                  label='Tuổi'
                  placeholder='VD: 20'
                  value=''
                  onChange={() => {}}
                  suffix=' tuổi'
                />
                <Ratiofield
                  label='Có người thân được chẩn đoán thừa cân/béo phì?'
                  options={yesNoOptions}
                  value=''
                  onChange={() => {}}
                />

                <Textfield
                  label='Chiều cao'
                  placeholder='VD: 1.65'
                  suffix=' m'
                />
                <Textfield label='Cân nặng' placeholder='VD: 52' suffix=' kg' />
              </div>
            </section>

            {/* Eating habits */}
            <section className={styles.section}>
              <h2 className={styles.section_title}>Thói quen ăn uống</h2>
              <div className={styles.grid_two}>
                <Ratiofield
                  label='Bạn có thường xuyên ăn thức ăn nhiều calo không?'
                  options={yesNoOptions}
                />
                <Ratiofield
                  label='Có theo dõi calo tiêu thụ hằng ngày không?'
                  options={yesNoOptions}
                />

                <Dropdown
                  label='Có thường xuyên ăn rau củ không?'
                  options={vegetableOptions}
                />
                <Dropdown
                  label='Uống bao nhiêu nước mỗi ngày?'
                  options={waterIntakeOptions}
                />

                <Textfield label='Số bữa ăn chính mỗi ngày' placeholder='3' />
                <Dropdown
                  label='Có ăn vặt xen giữa các bữa chính không?'
                  options={snackOptions}
                />
              </div>
            </section>

            {/* Activity habits */}
            <section className={styles.section}>
              <h2 className={styles.section_title}>
                Thói quen vận động và sinh hoạt
              </h2>
              <div className={styles.grid_two}>
                <Dropdown
                  label='Có thường xuyên tập thể dục không?'
                  options={physicalActivityOptions}
                />
                <Dropdown
                  label='Mức độ sử dụng thiết bị điện tử hằng ngày'
                  options={screenTimeOptions}
                />

                <Dropdown
                  label='Phương tiện di chuyển thường dùng'
                  options={transportationOptions}
                />
              </div>
            </section>

            {/* Other habits */}
            <section className={styles.section}>
              <h2 className={styles.section_title}>Thói quen khác</h2>
              <div className={styles.grid_two}>
                <Ratiofield
                  label='Bạn có hút thuốc không?'
                  options={yesNoOptions}
                />
                <Dropdown
                  label='Bạn có thường xuyên sử dụng thức uống có cồn không?'
                  options={alcoholOptions}
                />
              </div>
            </section>

            <button className={styles.submit_btn}>Submit</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PredictPage;
