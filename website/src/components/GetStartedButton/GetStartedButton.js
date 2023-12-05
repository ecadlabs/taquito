import React from 'react';
import styles from './GetStartedButton.module.scss';

export default () => {
    return (
        <div className={styles.getStartedButtonContainer}>
            <a className={styles.getStartedButton} href='/docs/quick_start'>
                Get Started
            </a>
        </div>
    );
};
