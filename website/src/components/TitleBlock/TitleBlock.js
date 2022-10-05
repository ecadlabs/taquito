import React from 'react';
import clsx from 'clsx';
import styles from './TitleBlock.module.scss';

const FeatureList = [
  {
    title: 'We Believe You Deserve A Great Developer Experience',
  },
];

function Feature({ title }) {
    return (
        <div className={styles.titleBlockContainer}>
            <h2 className={styles.titleBlockTitle}>{title}</h2>
        </div>
    );
}

export default function TitleBlock() {
    return (
        <section className={styles.features}>
            <div className={styles.container}>
                <Feature {...FeatureList[0]} />
            </div>
        </section>
    );
}
