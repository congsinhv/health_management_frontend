import React from 'react';

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: DropdownOption[];
  disabled?: boolean;
}

const Dropdown = (props: DropdownProps) => {
  return (
    <div className='flex w-full flex-col gap-1'>
      {props.label && (
        <label className='text-xs font-normal text-slate-500'>
          {props.label}
        </label>
      )}
      <div className='relative w-full'>
        <select
          className='bg-[url("data:image/svg+xml,%3Csvg width=\"12\" height=\"8\" viewBox=\"0 0 12 8\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M1 1L6 6L11 1\" stroke=\"%23B3B8C3\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/%3E%3C/svg%3E")] w-full cursor-pointer appearance-none rounded border border-slate-300 bg-white bg-[right_12px_center] bg-no-repeat px-4 py-2 pr-9 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600 focus:ring-offset-1 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60'
          value={props.value}
          onChange={e => props.onChange && props.onChange(e.target.value)}
          disabled={props.disabled}
        >
          {props.placeholder && (
            <option value='' disabled>
              {props.placeholder}
            </option>
          )}
          {props.options.map((option, index) => (
            <option
              key={index}
              value={option.value}
              className='bg-white px-2 py-1 text-slate-700 disabled:text-slate-400'
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Dropdown;
