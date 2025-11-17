import React from 'react';
import styles from './Dropdown.module.scss';

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
    <div className={styles.dropdown}>
      {props.label && (
        <label className={styles.dropdown_label}>{props.label}</label>
      )}
      <div className={styles.dropdown_select}>
        <select
          className={styles.dropdown_select_container}
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
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Dropdown;
