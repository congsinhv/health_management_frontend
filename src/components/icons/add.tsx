import React from 'react';

const AddIcon = () => {
  return (
    <svg
      width='42'
      height='42'
      viewBox='0 0 42 42'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g filter='url(#filter0_d_47_131)'>
        <rect
          x='6'
          y='6'
          width='30'
          height='30'
          rx='4'
          fill='white'
          shapeRendering='crispEdges'
        />
        <path
          d='M21 16V26M26 21H16'
          stroke='#1E1E1E'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
      <defs>
        <filter
          id='filter0_d_47_131'
          x='0'
          y='0'
          width='42'
          height='42'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feOffset />
          <feGaussianBlur stdDeviation='3' />
          <feComposite in2='hardAlpha' operator='out' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0'
          />
          <feBlend
            mode='normal'
            in2='BackgroundImageFix'
            result='effect1_dropShadow_47_131'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_47_131'
            result='shape'
          />
        </filter>
      </defs>
    </svg>
  );
};

export default AddIcon;
