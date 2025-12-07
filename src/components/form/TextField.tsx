import React from 'react';

interface TextFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  suffix?: string;
}

const TextField = (props: TextFieldProps) => {
  return (
    <div className='flex w-full flex-col gap-1'>
      {props.label && (
        <label className='text-xs font-normal text-slate-500'>
          {props.label}
        </label>
      )}
      <div className='relative'>
        <input
          className='focus:border-ring w-full rounded border border-(--grey-300) bg-(--white) px-4 py-2 text-[0.85rem] placeholder:text-slate-400 focus:border-2 focus:outline-none'
          type='text'
          placeholder={props.placeholder}
          value={props.value}
          onChange={e => props.onChange && props.onChange(e.target.value)}
        />
        {props.suffix && (
          <span className='absolute top-1/2 right-3 -translate-y-1/2 text-[0.85rem] text-slate-400'>
            {props.suffix}
          </span>
        )}
      </div>
    </div>
  );
};

export default TextField;
