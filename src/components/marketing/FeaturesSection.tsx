import React from 'react';
import { Button } from '@/components/ui/button';
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
    href: './predict',
  },
  {
    title: 'Đề xuất chế độ ăn uống & tập luyện',
    description:
      'Kế hoạch, thực đơn theo mục tiêu cùng lịch tập theo tuần, thời lượng, cường độ phù hợp.',
    linkText: 'Tạo kế hoạch mẫu',
    isHighlight: true,
    href: '/practice',
  },
  {
    title: 'Chatbot hỗ trợ sức khoẻ',
    description:
      'Trợ lý 24/7 trả lời về dinh dưỡng, luyện tập, theo dõi thói quen và nhắc lịch—hiểu câu hỏi tiếng Việt tự nhiên.',
    linkText: 'Chat ngay',
    href: './chatbox',
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
          <Button
            onClick={handleChat}
            variant='gradient'
            size='lg'
            className='gap-2 border border-teal-700'
          >
            <Star />
            Dự đoán sức khỏe ngay
          </Button>
          <h2 className='mt-2 w-[70%] text-4xl leading-tight font-semibold'>
            Dự Đoán Nguy Cơ Ăn Uống Khoa Học
          </h2>
          <p className='w-[90%] text-sm leading-relaxed'>
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
                <span>💬</span>
              </div>
              <h3
                className={`mb-3 w-[70%] text-lg font-semibold ${item.isHighlight ? 'text-white' : ''}`}
              >
                {item.title}
              </h3>
              <p
                className={`text-sm leading-relaxed ${item.isHighlight ? 'text-gray-100' : ''}`}
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
