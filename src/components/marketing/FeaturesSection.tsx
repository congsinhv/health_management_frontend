import React from 'react';
import { Button } from '@/components/ui/button';
import Star from '@/components/icons/star';

type FeatureCard = {
  title: string;
  description: string;
  linkText: string;
  isHighlight?: boolean;
  href?: string;
  icon: React.ReactNode;
};

const features: FeatureCard[] = [
  {
    title: 'Dự đoán nguy cơ thừa cân/béo phì',
    description:
      'AI phân tích tuổi, giới, số đo và thói quen để ước tính nguy cơ trong 3–12 tháng tới.',
    linkText: 'Dự đoán ngay',
    href: './predict',
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth='1.5'
        stroke='currentColor'
        className='size-6'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z'
        />
      </svg>
    ),
  },
  {
    title: 'Đề xuất chế độ ăn uống & tập luyện',
    description:
      'Kế hoạch, thực đơn theo mục tiêu cùng lịch tập theo tuần, thời lượng, cường độ phù hợp.',
    linkText: 'Xem kế hoạch mẫu',
    isHighlight: true,
    href: './predict',
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth='1.5'
        stroke='currentColor'
        className='size-6'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z'
        />
      </svg>
    ),
  },
  {
    title: 'Chatbot hỗ trợ sức khoẻ',
    description:
      'Trợ lý 24/7 trả lời về dinh dưỡng, luyện tập, theo dõi thói quen và nhắc lịch—hiểu câu hỏi tiếng Việt tự nhiên.',
    linkText: 'Chat ngay',
    href: './chatbox',
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth='1.5'
        stroke='currentColor'
        className='size-6'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z'
        />
      </svg>
    ),
  },
];

const FeaturesSection = () => {
  const handleChat = () => {
    // TODO: Implement chat functionality
  };

  return (
    <section className='w-full bg-[#f1fffc] px-6 py-32 text-center text-gray-800'>
      <div className='mx-auto w-[80%]'>
        <div className='mx-auto mb-12 flex w-1/2 flex-col items-center justify-center gap-2'>
          <h2 className='mt-2 w-[70%] text-4xl leading-tight font-semibold'>
            Dự Đoán Nguy Cơ
            <br />
            Ăn Uống Khoa Học
          </h2>
          <p className='w-[90%] text-[0.85rem] leading-relaxed'>
            Công cụ AI giúp bạn kiểm soát cân nặng qua ba tính năng: dự đoán
            nguy cơ, kế hoạch ăn–tập cá nhân hoá và trợ lý sức khoẻ 24/7.
          </p>
        </div>

        <div className='mt-12 grid grid-cols-1 gap-6 md:grid-cols-3'>
          {features.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col rounded-2xl p-10 text-left shadow-sm transition-all duration-300 hover:-translate-y-4 ${item.isHighlight ? 'bg-[#2c7a7b] text-white' : 'bg-white'}`}
            >
              <div className='mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-cyan-400 to-green-400 text-xl'>
                {item.icon}
              </div>
              <h3
                className={`mb-3 w-[70%] text-lg font-semibold ${item.isHighlight ? 'text-white' : ''}`}
              >
                {item.title}
              </h3>
              <p
                className={`text-[0.85rem] leading-relaxed ${item.isHighlight ? 'text-gray-100' : ''}`}
              >
                {item.description}
              </p>
              <a
                href={item.href}
                className={`mt-3 font-medium underline ${item.isHighlight ? 'text-white' : ''}`}
              >
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
