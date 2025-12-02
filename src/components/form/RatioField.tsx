import React from 'react';

interface RatioFieldOption {
  label: string;
  value: string;
}

interface RatioFieldProps {
  label?: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  options?: RatioFieldOption[];
}

const RatioField = (props: RatioFieldProps) => {
  const optionsToUse = props.options || [];

  return (
    <div className='flex w-full flex-col gap-2'>
      {props.label && (
        <label className='text-xs font-normal text-slate-500'>
          {props.label}
        </label>
      )}
      <div className='flex items-center gap-4'>
        {optionsToUse.map((option, index) => (
          <label
            key={index}
            className='group flex cursor-pointer items-center gap-2 select-none hover:text-teal-600'
          >
            <input
              type='radio'
              name={props.name}
              value={option.value}
              checked={props.value === option.value}
              onChange={e => props.onChange && props.onChange(e.target.value)}
              className='h-4 w-4 cursor-pointer accent-teal-600 focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 focus:outline-none'
            />
            <span className='text-sm font-normal text-slate-700 group-hover:text-teal-600'>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RatioField;
