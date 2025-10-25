'use client';

import Link from 'next/link';
import { useState } from 'react';
import WorkoutMain from '@/app/practice/practiceMain';
import Nutrition from '@/app/eat/page';

import { Button } from '@/components/ui/button';

export default function PracticePage() {
  const [activeTab, setActiveTab] = useState('workout');

  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='border-b bg-white dark:bg-gray-800'>
        <div className='container mx-auto flex h-16 items-center justify-between px-4'>
          <div className='flex items-center space-x-2'>
            <div className='h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500'></div>
            <span className='text-xl font-bold'>Health Management</span>
          </div>
          <nav className='hidden space-x-6 md:flex'>
            <Link
              href='/dashboard'
              className='text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100'
            >
              Dashboard
            </Link>
            <Link
              href='/health-tracking'
              className='text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100'
            >
              Health Tracking
            </Link>
            <Link
              href='/profile'
              className='text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100'
            >
              Profile
            </Link>
            <Link
              href='/practice'
              className='text-blue-600 hover:text-blue-800 dark:text-blue-400'
            >
              Tập luyện
            </Link>

            <Link
              href='/settings'
              className='text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100'
            >
              Settings
            </Link>
          </nav>
          <Button variant='outline' size='sm'>
            Logout
          </Button>
        </div>
      </header>

      <div className='mx-auto max-w-5xl px-4 py-12'>
        <h1 className='mb-4 text-4xl font-bold text-gray-800'>
          Chào mừng đến với Health App
        </h1>
        <p className='mb-8 text-gray-600'>
          Khám phá các chương trình tập luyện, chế độ ăn uống và dịch vụ sức
          khỏe phù hợp với bạn.
        </p>

        <div className='grid grid-cols-1 gap-30 md:grid-cols-2'>
          <div
            onClick={() => setActiveTab('workout')}
            className={`cursor-pointer rounded-2xl p-6 shadow-lg transition ${
              activeTab === 'workout'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 hover:shadow-xl'
            }`}
          >
            <h2 className='mb-2 text-xl font-bold'>🏋️ Tập luyện</h2>
            <p>
              Lập kế hoạch tập luyện cá nhân, kiểm soát lịch tập và theo dõi
              tiến độ.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('nutrition')}
            className={`cursor-pointer rounded-2xl p-6 shadow-lg transition ${
              activeTab === 'nutrition'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 hover:shadow-xl'
            }`}
          >
            <h2 className='mb-2 text-xl font-bold'>🥗 Ăn uống</h2>
            <p>
              Gợi ý thực đơn, theo dõi lượng calo và chế độ dinh dưỡng hàng
              ngày..
            </p>
          </div>

          {/* <div
            onClick={() => setActiveTab("service")}
            className={`cursor-pointer p-6 rounded-2xl shadow-lg transition ${
              activeTab === "service" ? "bg-purple-600 text-white" : "bg-white text-gray-800 hover:shadow-xl"
            }`}
          >
            <h2 className="text-xl font-bold mb-2">💆 Dịch vụ</h2>
            <p>Đặt lịch tư vấn, massage, hoặc các dịch vụ chăm sóc sức khỏe khác.</p>
          </div> */}
        </div>

        <div className='mt-12'>
          {activeTab === 'workout' && <WorkoutMain />}
          {activeTab === 'nutrition' && <Nutrition />}
          {activeTab === 'service' && (
            <p>Chức năng Dịch vụ đang phát triển...</p>
          )}
        </div>
      </div>
    </div>
  );
}
