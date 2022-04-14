import React from 'react';
import clsx from 'clsx';
import styles from './SimpleWay.module.scss';
import SimpleWaySvg from '../../../static/img/simple-way-svg.svg';

const FeatureList = [
  {
    title: 'Looking for a simple way to work with Tezos?',
    ways: [
      {
        text: 'Tired of figuring out what is needed to make that RPC work?',
      },
      {
        text: 'Takes long to integrate with a wallet?',
      },
      {
        text: 'Too many steps to send an operation?',
      },
      {
        text: 'Want a library that is always up-to-date with the upcoming',
      },
      {
        text: 'Wish there were higher-level abstractions?',
      },
      {
        text: 'Looking for an extensible framework with minimanl',
      },
    ],
  },
];

function Feature({ ways, title }) {
  return (
    <div className={styles.waysContainer}>
      <h2 className={styles.waysTitle}>{title}</h2>
      <div className={styles.waysGroup}>
        {ways.map((way, idx) => (
          <div className={styles.wayCard} key={idx}>
            <p className={styles.wayText}>{way.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SimpleWay() {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <Feature {...FeatureList[0]} />
        <SimpleWaySvg className={styles.simpleWaySvg} />
      </div>
    </section>
  );
}
