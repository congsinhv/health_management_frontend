import React from 'react';
import Image from 'next/image';

const images = [
  'https://plus.unsplash.com/premium_photo-1709077628025-4cb21667cc48?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987',
  'https://images.unsplash.com/photo-1734515515416-21bbe9f35775?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070',
  'https://images.unsplash.com/photo-1718793834155-ba3bd687b04a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1017',
];

const InformationSection = () => {
  return (
    <section className='flex h-screen w-full flex-col justify-center gap-12 text-center text-gray-800'>
      <div className='mx-auto grid w-[65%] grid-cols-4 gap-2'>
        {images.map((src, index) => (
          <div
            className={`w-full flex-1 flex-shrink-0 basis-[120px] overflow-hidden rounded-2xl ${index === 1 ? 'col-span-2' : ''}`}
            key={index}
          >
            <Image
              src={src}
              alt={`infor lifestyle ${index + 1}`}
              className='block h-full w-full rounded-2xl object-cover'
              width={400}
              height={300}
            />
          </div>
        ))}
      </div>

      <div className='mx-auto flex max-w-[65%] flex-col gap-2'>
        <h2 className='text-4xl leading-tight font-semibold md:text-4xl'>
          Sống Khỏe Mỗi Ngày
        </h2>
        <p className='text-sm leading-relaxed'>
          Nền tảng sử dụng thuật toán học máy đã thẩm định nội bộ, hiệu năng đo
          bằng AUC/F1 (≥ ghi số thực tế của bạn) và được đối chiếu bởi đội ngũ
          chuyên môn. Chúng tôi khuyến cáo người dùng kiểm tra định kỳ các chỉ
          số BMI, vòng eo, huyết áp và thói quen ăn–tập để giảm rủi ro thừa
          cân/béo phì và bệnh chuyển hóa. Dữ liệu được ẩn danh & mã hóa theo
          tiêu chuẩn ngành. <br />
          <span className='mt-2 block text-[15px] text-gray-600 italic'>
            * Tham khảo bác sĩ khi có bất kỳ dấu hiệu bất thường.
          </span>
        </p>
      </div>
    </section>
  );
};

export default InformationSection;
