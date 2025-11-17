import React from 'react';
import styles from './Ratiofield.module.scss';

interface RatiofieldOption {
  label: string;
  value: string;
}

interface RatiofieldProps {
  label?: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  options?: RatiofieldOption[];
}

const Ratiofield = (props: RatiofieldProps) => {
  const optionsToUse = props.options || [];

  return (
    <div className={styles.ratiofield}>
      {props.label && (
        <label className={styles.ratiofield_label}>{props.label}</label>
      )}
      <div className={styles.ratiofield_options}>
        {optionsToUse.map((option, index) => (
          <label key={index} className={styles.ratiofield_option}>
            <input
              type='radio'
              name={props.name}
              value={option.value}
              checked={props.value === option.value}
              onChange={e => props.onChange && props.onChange(e.target.value)}
              className={styles.ratiofield_input}
            />
            <span className={styles.ratiofield_option_label}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Ratiofield;
