import React from 'react';

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

const NumberInput = () => {
  return (
    <section className='w-full'>
      <div className='mx-auto flex w-[65%] flex-wrap items-center justify-between gap-4 py-32'>
        {number.map((item, index) => (
          <div
            className='flex max-w-[190px] flex-col items-center justify-center text-center'
            key={index}
          >
            <h2 className='text-5xl font-[var(--font-gilroy)] font-semibold'>
              {item.value}
            </h2>
            <p className='text-[0.85rem] font-[var(--font-gilroy)] text-gray-600'>
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NumberInput;
