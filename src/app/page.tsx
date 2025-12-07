'use client';

import NumberInput from '@/components/form/NumberInput';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import FeaturesSection from '@/components/marketing/FeaturesSection';
import InformationSection from '@/components/marketing/InformationSection';
import Card from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const gridData = [
  {
    id: 1,
    image: '/healthcare-image1.png',
    description:
      'Trợ lý ảo cá nhân hoá giúp bạn xây dựng kế hoạch ăn uống và lối sống phù hợp.',
  },
  {
    id: 2,
    image: '/healthcare_image2.png',
    description:
      'Công nghệ AI tiên tiến giúp bạn hiểu rõ cơ thể và đưa ra quyết định sức khỏe chính xác.',
  },
  {
    id: 3,
    image: '/healthcare_image3.png',
    description:
      'Cung cấp thông tin và công cụ hỗ trợ để bạn duy trì lối sống lành mạnh và cân bằng.',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const handleChat = () => {
    router.push('/chatbox');
  };

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className='grid w-full grid-cols-14 gap-4 px-4'>
        <div className='col-span-14 h-[55vh] rounded-2xl bg-linear-to-l from-emerald-400 via-cyan-200 to-emerald-300'>
          <div className='flex h-full w-[60%] flex-col items-start justify-center gap-2 pl-16'>
            <h1 className='text-5xl leading-tight font-semibold text-white'>
              Kiểm Soát Cân Nặng <br /> Ăn Lành Mạnh
            </h1>
            <p className='mb-2 w-[57%] text-base font-medium text-white'>
              Trò chuyện trực tiếp với trợ lý sức khỏe, nhận gợi ý chế độ ăn cá
              nhân hoá và dự đoán nguy cơ thừa cân, béo phì
            </p>
            <Button
              onClick={handleChat}
              variant='gradient'
              size='lg'
              className='h-auto gap-2 bg-white px-6 py-2 font-semibold text-black hover:border-gray-400 hover:bg-gray-50'
            >
              Dự đoán sức khỏe ngay
            </Button>
          </div>
        </div>
        <div className='col-span-14 mb-8 flex h-[30vh] flex-row justify-between gap-4'>
          {gridData.slice(0, 2).map((item, index) => (
            <Card
              index={index}
              key={index}
              id={item.id}
              image={item.image}
              description={item.description}
            />
          ))}
          <div className='relative flex min-h-[200px] w-[24%] shrink-0 flex-col items-start justify-center gap-12 overflow-hidden rounded-2xl bg-linear-to-br from-[#f0fff9] via-[#fff0f7] p-8'>
            <div className='flex h-max w-[90%] flex-col gap-2'>
              <h3 className='font-semibold text-emerald-600'>
                Người bạn đồng hành{' '}
              </h3>
              <p className='text-[0.85rem] leading-relaxed text-gray-800'>
                Người bạn đồng hành đáng tin cậy trong hành trình sức khỏe của
                bạn.
              </p>
              <div className='relative'>
                <Image
                  src='/icons/Decorate1.svg'
                  alt='Custom Content Block 1'
                  width={24}
                  height={24}
                />
                <Image
                  src='/icons/Decorate2.svg'
                  alt='Custom Content Block 2'
                  width={24}
                  height={24}
                />
              </div>
            </div>
            <div className='flex w-full flex-row justify-between'>
              <div className='flex flex-row gap-0'>
                <Image
                  src='/Avatar1.png'
                  alt='Custom Content Block 4'
                  width={32}
                  height={32}
                  className='max-h-13 max-w-13 object-cover'
                />
                <Image
                  src='/Avatar2.png'
                  alt='Custom Content Block 5'
                  width={32}
                  height={32}
                  className='max-h-13 max-w-13 object-cover'
                />
              </div>
              <Image
                className='max-h-6 w-[6%] max-w-6 object-cover'
                src='/icons/Feedback.svg'
                alt='Custom Content Block 6'
                width={20}
                height={20}
              />
            </div>
          </div>
          <Card
            index={2}
            key={2}
            id={gridData[2].id}
            image={gridData[2].image}
            description={gridData[2].description}
          />
        </div>
      </div>
      <NumberInput />
      <FeaturesSection />
      <InformationSection />
      {/* Footer */}
      <Footer />
    </div>
  );
}
