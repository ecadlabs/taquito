import React from 'react';
import styles from './SimpleWay.module.scss';
import SimpleWaySvg from '../../../static/img/logo-taquito-color.svg';
import StartNowButton from '../StartNowButton/StartNowButton';

const FeatureList = [
  {
    title: 'Looking for a simple way to work with Tezos?',
    ways: [
      {
        text: 'Tired of figuring out what is needed to make that RPC work?',
      },
      {
        text: 'Takes too long to integrate with a wallet?',
      },
      {
        text: 'Too many steps to send an operation?',
      },
      {
        text: 'Want a library that is always up-to-date with the upcoming protocol changes?',
      },
      {
        text: 'Wish there were higher-level abstractions?',
      },
      {
        text: 'Looking for an extensible framework with minimal dependencies?',
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
      <StartNowButton darkBg={true} />
    </div>
  );
}

export default function SimpleWay() {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <Feature {...FeatureList[0]} />
        <div className={styles.simpleWaySvg}>
          <SimpleWaySvg />
        </div>
      </div>
    </section>
  );
}
