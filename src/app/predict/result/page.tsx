'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { PredictionResultData } from '@/types/prediction';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import UserInfoSection from '@/components/predict/UserInfoSection';
import PredictionResultCard from '@/components/predict/PredictionResultCard';
import HealthMetricsCard from '@/components/predict/HealthMetricsCard';
import HealthAnalysisSection from '@/components/predict/HealthAnalysisSection';
import DietPlanSection from '@/components/predict/DietPlanSection';
import WorkoutPlanSection from '@/components/predict/WorkoutPlanSection';

const PredictionResultPage = () => {
  const router = useRouter();
  const [resultData, setResultData] = useState<PredictionResultData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Retrieve prediction result from sessionStorage
    const storedResult = sessionStorage.getItem('predictionResult');

    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        setResultData(parsedResult);
      } catch (error) {
        console.error('Error parsing prediction result:', error);
      }
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <>
        <Header className='sticky top-0 left-0 z-50 w-full' />
        <div className='flex min-h-screen items-center justify-center pt-24'>
          <div className='text-center'>
            <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#4FD1C5]'></div>
            <p className='text-gray-600'>Đang tải kết quả...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!resultData) {
    return (
      <>
        <Header className='sticky top-0 left-0 z-50 w-full' />
        <div className='flex min-h-screen items-center justify-center pt-24'>
          <div className='text-center'>
            <h2 className='mb-4 text-2xl font-semibold'>
              Không tìm thấy kết quả
            </h2>
            <p className='mb-6 text-gray-600'>
              Vui lòng điền biểu mẫu dự đoán trước.
            </p>
            <Button
              onClick={() => router.push('/predict')}
              className='bg-[#4FD1C5] text-white hover:bg-[#3DBDB1]'
            >
              Quay lại biểu mẫu
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleDownload = () => {
    // TODO: Implement PDF/JSON export functionality
    console.log('Download functionality to be implemented');
  };

  return (
    <>
      <Header className='sticky top-0 left-0 z-50 w-full' />
      <div className='min-h-screen bg-white px-[1.5rem]'>
        {/* Title Banner */}
        <div
          className='mb-8 rounded-2xl px-[3.5rem] py-[4.375rem]'
          style={{
            background:
              'linear-gradient(185deg, #32F6B4 0%, #9DFFEA 32%, #3AD0C5 68%, #50C79F 100%)',
          }}
        >
          <div className='mx-auto max-w-[90rem] px-4 md:px-6 lg:px-8'>
            <h1 className='text-3xl font-bold text-white md:text-4xl'>
              Kết quả dự đoán
            </h1>
            <p className='mt-2 text-sm text-white md:text-base'>
              Trò chuyện trực tiếp với trợ lý sức khỏe, nhận gợi ý chế độ ăn{' '}
              <br className='hidden md:block' />
              cá nhân hoá và dự đoán nguy cơ thừa cân, béo phì
            </p>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className='pb-16'>
          <div className='grid w-full grid-cols-24 gap-6'>
            {/* Left Column - User Information */}
            <div className='col-span-7'>
              <div className='sticky top-24 rounded-3xl border-2 border-[#EFEFEF] bg-white px-4 py-6'>
                <h2 className='flex items-center justify-between pb-4 font-semibold'>
                  Thông tin đã điền
                  {/* Download Button */}
                  <div>
                    <Button
                      onClick={handleDownload}
                      className='w-full rounded-full bg-[#1E1E1E] px-4! py-2! text-white hover:bg-[#1E1E1E]/80'
                      variant='default'
                    >
                      <Download className='h-4 w-4' />
                      Tải về
                    </Button>
                  </div>
                </h2>
                <UserInfoSection data={resultData.userInput} />
              </div>
            </div>

            {/* Right Column - Prediction Results and Recommendations */}
            <div className='col-span-17 space-y-6'>
              <div className='flex gap-2'>
                {/* Prediction Result Card */}
                <div className='flex-2 rounded-3xl border-2 border-[#EFEFEF] bg-white px-4 py-6'>
                  <h2 className='mb-6 flex justify-between font-semibold text-[#1E1E1E]'>
                    Kết quả dự đoán
                    <span className='text-xs font-medium text-[#1E1E1E] before:mr-1 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-[#70DACC] before:content-[""]'>
                      Độ tin cậy
                    </span>
                  </h2>
                  <PredictionResultCard result={resultData.prediction} />
                </div>
                {/* Health Metrics Cards */}
                <div className='flex-2 rounded-3xl border-2 border-[#EFEFEF] bg-white px-4 py-6'>
                  <h2 className='mb-4 font-semibold text-[#1E1E1E]'>
                    Các chỉ số sức khoẻ
                  </h2>
                  <HealthMetricsCard metrics={resultData.healthMetrics} />
                </div>
              </div>

              {/* Health Analysis Section */}
              <div className='rounded-3xl border-2 border-[#EFEFEF] bg-white px-4 py-6'>
                <h2 className='mb-6 flex justify-between pb-4 font-semibold'>
                  Phân tích sức khoẻ dựa trên kết quả dự đoán
                  <span className='text-xs font-normal text-[#1E1E1E]'>
                    * Phân tích chỉ mang tính tham khảo
                  </span>
                </h2>
                <HealthAnalysisSection analysis={resultData.healthAnalysis} />
              </div>

              {/* Diet Plan Section */}
              <div className='rounded-3xl border-2 border-[#EFEFEF] bg-white px-4 py-6'>
                <DietPlanSection dietPlan={resultData.dietPlan} />
              </div>

              {/* Workout Plan Section */}
              <div className='rounded-3xl border-2 border-[#EFEFEF] bg-white px-4 py-6'>
                <WorkoutPlanSection workoutPlan={resultData.workoutPlan} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PredictionResultPage;
