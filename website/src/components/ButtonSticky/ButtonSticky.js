import React from 'react';
import clsx from 'clsx';
import styles from './ButtonSticky.module.scss';

const FeatureList = [
  {
    link: {
      title: 'Get Started',
      url: '/docs/quick_start',
      text: 'Ready to start?',
    },
  },
];

function Feature({ link }) {
  return (
    <div className={styles.waysButtonContainer}>
      <h6 className={styles.waysButtonText}>{link.text}</h6>
      <a className={styles.waysButton} href={link.url}>
        {link.title}
      </a>
    </div>
  );
}

export default function ButtonSticky() {
  return (
    <section className={styles.features}>
        <Feature {...FeatureList[0]} />
    </section>
  );
}
