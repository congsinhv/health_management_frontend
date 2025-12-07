import React from 'react';
import { HealthMetrics } from '@/types/prediction';
import { cn } from '@/lib/utils';

interface HealthMetricsCardProps {
  metrics: HealthMetrics;
}

const HealthMetricsCard: React.FC<HealthMetricsCardProps> = ({ metrics }) => {
  return (
    <div className='grid grid-cols-3 gap-4'>
      {/* Weight Card */}
      <MetricCard
        icon={<WeightIcon />}
        label={metrics.weight.label}
        value={metrics.weight.value}
        unit={metrics.weight.unit}
        left
      />

      {/* BMI Card */}
      <MetricCard
        icon={<BMIIcon />}
        label={metrics.bmi.label}
        value={metrics.bmi.value}
        unit={metrics.bmi.unit}
        center
      />

      {/* Height Card */}
      <MetricCard
        icon={<HeightIcon />}
        label={metrics.height.label}
        value={metrics.height.value}
        unit={metrics.height.unit}
        right
      />
    </div>
  );
};

// Individual Metric Card Component
interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  left?: boolean;
  center?: boolean;
  right?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  label,
  value,
  unit,
  left,
  center,
  right,
}) => {
  return (
    <div className='aspect-[0.85] rounded-2xl bg-[#97FFDC]/50 transition-shadow hover:shadow-md'>
      <div className='flex flex-col'>
        <div
          className={cn(
            'my-4 min-h-[4.25rem]',
            right && 'ml-auto',
            center && 'mx-auto',
            left && 'mr-auto'
          )}
        >
          {icon}
        </div>
        <div className='pl-4'>
          <p className='font-semibold text-gray-900'>{label}</p>
          <div className='flex items-baseline gap-1'>
            <span className='text-[0.85rem] text-gray-900'>{value}</span>
            <span className='text-gray-600'>{unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom SVG Icons
const WeightIcon = () => (
  <svg
    width='123'
    height='68'
    viewBox='0 0 123 68'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M37 19.6488C50.6 21.8875 61.3333 19.6488 65 18.2497L63.5 53.2289C35.5 61.624 37 52.8791 23 52.1796C11.8 51.6199 3 57.0767 0 59.875V16.5007C18 10.2044 20 16.8505 37 19.6488Z'
      fill='#1E1E1E'
    />
    <path
      d='M89.5515 3.33763L56.5 12.1937L63.0782 67.0656H115.543L122.924 12.1937L89.5515 3.33763Z'
      fill='#B1B2B8'
    />
    <circle cx='89.7117' cy='16.2048' r='16.2048' fill='white' />
    <path
      d='M89.8721 0C99.0876 0 106.559 7.471 106.559 16.6865C106.558 24.9168 100.599 31.7541 92.7607 33.1221V50.8604C92.7607 52.3666 91.5394 53.5877 90.0332 53.5879C88.5268 53.5879 87.3057 52.3667 87.3057 50.8604V33.1748C79.3089 31.9401 73.1867 25.029 73.1865 16.6865C73.1865 7.4711 80.6567 0.000155082 89.8721 0ZM89.8721 4.77734C83.2949 4.7775 77.9629 10.1093 77.9629 16.6865C77.9631 23.2636 83.295 28.5955 89.8721 28.5957C96.4492 28.5957 101.781 23.2637 101.781 16.6865C101.781 10.1092 96.4494 4.77734 89.8721 4.77734Z'
      fill='#D9D9D9'
    />
    <rect
      x='93.8936'
      y='6.73865'
      width='4.81332'
      height='12.8355'
      rx='2.40666'
      transform='rotate(30.8841 93.8936 6.73865)'
      fill='url(#paint0_linear_327_209)'
    />
    <defs>
      <linearGradient
        id='paint0_linear_327_209'
        x1='96.3002'
        y1='6.73865'
        x2='96.3002'
        y2='19.5742'
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#32F6B4' />
        <stop offset='1' stopColor='#14B6E2' />
      </linearGradient>
    </defs>
  </svg>
);

const BMIIcon = () => (
  <svg
    width='93'
    height='51'
    viewBox='0 0 93 51'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <rect width='93' height='51' rx='14' fill='#1E1E1E' />
    <circle cx='46.5' cy='25.5' r='16' fill='white' />
    <path
      d='M51.9827 15.5823C50.4037 14.7924 48.6637 14.3774 46.8982 14.3697C45.1326 14.3619 43.3891 14.7615 41.8031 15.5375L43.3038 18.6047C44.418 18.0596 45.6428 17.7789 46.8832 17.7843C48.1235 17.7898 49.3458 18.0813 50.4551 18.6362L51.9827 15.5823Z'
      fill='#1E1E1E'
    />
    <path
      d='M40.8055 16.0886C39.1612 17.1066 37.8008 18.5236 36.8506 20.2079C35.9004 21.8923 35.3911 23.7894 35.3701 25.7232L38.7846 25.7603C38.7993 24.4018 39.1571 23.069 39.8246 21.8858C40.4922 20.7025 41.4479 19.7071 42.603 18.9919L40.8055 16.0886Z'
      fill='#1E1E1E'
    />
    <path
      d='M58.326 25.8478C58.326 23.8873 57.8238 21.9595 56.8674 20.2481C55.9109 18.5367 54.5321 17.0988 52.8623 16.0715L51.073 18.9799C52.246 19.7016 53.2147 20.7117 53.8866 21.914C54.5585 23.1162 54.9113 24.4705 54.9113 25.8478H58.326Z'
      fill='#1E1E1E'
    />
    <path
      d='M47.4053 16.9311C47.5389 16.3716 48.091 16.0175 48.6553 16.1294C49.2195 16.2413 49.5949 16.7791 49.5049 17.3471L48.4043 24.2729C48.7328 24.6417 48.9346 25.1259 48.9346 25.6587C48.9346 26.8112 48.0002 27.7455 46.8477 27.7456C45.6951 27.7456 44.7607 26.8113 44.7607 25.6587C44.7607 24.9116 45.1541 24.2578 45.7441 23.8891L47.4053 16.9311Z'
      fill='#1E1E1E'
      stroke='white'
      strokeWidth='0.695652'
    />
    <path
      d='M45.7548 29.6739V35.2391H44.5967V31.6193L43.0499 35.2391H42.1731L40.618 31.6193V35.2391H39.46V29.6739H40.7752L42.6115 33.812L44.4478 29.6739H45.7548Z'
      fill='#1E1E1E'
    />
    <path
      d='M50.1753 32.3848C50.5007 32.4432 50.7681 32.6 50.9777 32.8552C51.1872 33.1103 51.292 33.4027 51.292 33.7322C51.292 34.0299 51.2148 34.293 51.0604 34.5216C50.9115 34.7448 50.6937 34.9202 50.4069 35.0478C50.1202 35.1753 49.781 35.2391 49.3895 35.2391H46.8997V29.6739H49.282C49.6735 29.6739 50.0099 29.735 50.2911 29.8573C50.5779 29.9796 50.7929 30.1496 50.9363 30.3676C51.0852 30.5855 51.1597 30.8327 51.1597 31.1091C51.1597 31.4333 51.0687 31.7044 50.8867 31.9223C50.7102 32.1403 50.4731 32.2944 50.1753 32.3848ZM48.0577 31.9702H49.1165C49.3923 31.9702 49.6046 31.9117 49.7535 31.7948C49.9024 31.6725 49.9768 31.4998 49.9768 31.2765C49.9768 31.0533 49.9024 30.8805 49.7535 30.7583C49.6046 30.636 49.3923 30.5749 49.1165 30.5749H48.0577V31.9702ZM49.2241 34.3302C49.5053 34.3302 49.7231 34.2664 49.8775 34.1388C50.0375 34.0113 50.1174 33.8306 50.1174 33.5967C50.1174 33.3575 50.0347 33.1714 49.8693 33.0386C49.7038 32.9004 49.4805 32.8313 49.1993 32.8313H48.0577V34.3302H49.2241Z'
      fill='#1E1E1E'
    />
    <path d='M53.373 29.6739V35.2391H52.215V29.6739H53.373Z' fill='#1E1E1E' />
  </svg>
);

const HeightIcon = () => (
  <svg
    width='124'
    height='67'
    viewBox='0 0 124 67'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M86.5 19.6488C72.9 21.8875 62.1667 19.6488 58.5 18.2497L60 53.2289C88 61.624 86.5 52.8791 100.5 52.1796C111.7 51.6199 120.5 57.0767 123.5 59.875V16.5007C105.5 10.2044 103.5 16.8505 86.5 19.6488Z'
      fill='#1E1E1E'
    />
    <path
      d='M40.833 27.3788L33.8744 21M33.8744 21L27.2471 27.3788M33.8744 21V46.1008M33.8744 46.1008L40.833 39.5564M33.8744 46.1008L27.2471 39.5564'
      stroke='white'
      strokeWidth='2.48523'
      strokeLinecap='round'
    />
    <rect
      width='67'
      height='67'
      rx='28.2889'
      transform='matrix(-1 0 0 1 67 0)'
      fill='#B1B2B8'
    />
    <path
      d='M29.5 23L27.4024 20M27.4024 20L25 23M27.4024 20V48'
      stroke='url(#paint0_linear_327_221)'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M32.5 24.0707V20H44.5V48H32.5V43.8743H35.5145V40.9587H32.5V38.0982H38.413V35.1827H32.5V32.5422H35.5145V29.6817H32.5V26.8212H38.413V24.0707H32.5Z'
      fill='white'
    />
    <defs>
      <linearGradient
        id='paint0_linear_327_221'
        x1='27.25'
        y1='20'
        x2='27.25'
        y2='48'
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#32F6B4' />
        <stop offset='1' stopColor='#14B6E2' />
      </linearGradient>
    </defs>
  </svg>
);

export default HealthMetricsCard;
