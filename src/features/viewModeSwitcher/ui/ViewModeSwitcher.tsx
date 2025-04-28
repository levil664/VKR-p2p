import React from 'react';
import { MdViewList, MdViewModule } from 'react-icons/md';
import styles from './styles.module.scss';

interface ViewModeSwitcherProps {
  viewMode: 'table' | 'card';
  onChange: (mode: 'table' | 'card') => void;
}

export const ViewModeSwitcher: React.FC<ViewModeSwitcherProps> = ({ viewMode, onChange }) => {
  return (
    <div className={styles.viewSwitcher}>
      <div className={`${styles.switcher} ${viewMode === 'table' ? styles.left : styles.right}`} />
      <MdViewList
        onClick={() => onChange('table')}
        className={`${styles.icon} ${viewMode === 'table' ? styles.active : ''}`}
        size={32}
      />
      <MdViewModule
        onClick={() => onChange('card')}
        className={`${styles.icon} ${viewMode === 'card' ? styles.active : ''}`}
        size={32}
      />
    </div>
  );
};
