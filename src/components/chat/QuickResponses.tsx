import React from 'react';
import styles from './QuickResponses.module.scss';

interface QuickResponsesProps {
  choices: string[];
  onSelect: (choice: string) => void;
}

export const QuickResponses: React.FC<QuickResponsesProps> = ({
  choices,
  onSelect,
}) => {
  return (
    <div className={styles.quick_responses}>
      {choices.map((choice, index) => (
        <button
          key={index}
          className={styles.response_button}
          onClick={() => onSelect(choice)}
        >
          {choice}
        </button>
      ))}
    </div>
  );
};

export default QuickResponses;
