import React from 'react';
import styles from './Textfield.module.scss';

interface TextfieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  suffix?: string;
}

const Textfield = (props: TextfieldProps) => {
  return (
    <div className={styles.textfield}>
      {props.label && (
        <label className={styles.textfield_label}>{props.label}</label>
      )}
      <div className={styles.textfield_input}>
        <input
          className={styles.textfield_input_container}
          type='text'
          placeholder={props.placeholder}
          value={props.value}
          onChange={e => props.onChange && props.onChange(e.target.value)}
        />
        {props.suffix && (
          <span className={styles.textfield_suffix}>{props.suffix}</span>
        )}
      </div>
    </div>
  );
};

export default Textfield;
