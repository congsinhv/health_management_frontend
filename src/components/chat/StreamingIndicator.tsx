import React from 'react';
import styles from './ChatMessage.module.scss';

export const StreamingIndicator: React.FC = () => {
  return (
    <span className={styles.streaming_cursor}>
      <span className={styles.cursor_blink}>|</span>
    </span>
  );
};
