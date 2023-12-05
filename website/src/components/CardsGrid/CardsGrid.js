/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import styles from './CardsGrid.module.scss';
import GetStartedButton from '../GetStartedButton/GetStartedButton';

const FeatureList = [
  {
    title: 'What makes Taquito so amazing?',
    cards: [
      {
        icon: require('../../../static/img/briefcase.svg').default,
        title: 'Easy to use',
        description:
          "Taquito's abstractions are simple to understand and use. Working with Tezos contracts feels like working with JavaScript objects.",
      },
      {
        icon: require('../../../static/img/key.svg').default,
        title: 'Catch Errors Early',
        description:
          'Taquito uses TypeScript to extend JavaScript so that you can catch errors earlier.',
      },
      {
        icon: require('../../../static/img/box.svg').default,
        title: 'Portable',
        description:
          'Perfect for any JavaScript project on the front-end, back-end or command line with minimal dependencies.',
      },
      {
        icon: require('../../../static/img/credit_card.svg').default,
        title: 'Well Supported',
        description:
          'Taquito has a well-documented API, runs continuous integration tests against the Tezos Node and a set of Beacon wallets.',
      },
    ],
  },
];

function Feature({ title, cards }) {
  return (
    <div className={styles.content}>
      <div className={styles.cardsGridContainer}>
        <div className={styles.cardsGridTitleContainer}>
          <h1 className={styles.cardsGridTitle}>{title}</h1>
          <GetStartedButton />
        </div>
        <div className={styles.cardsGridCards}>
          {cards.map((card, idx) => (
            <div className={styles.cardContainer} key={idx}>
              <div className={styles.cardBox}>
                <card.icon className={styles.cardSvg} alt={card.title} />
                <h4 className={styles.cardTitle}>{card.title}</h4>
                <p className={styles.description}>{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CardsGrid() {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <Feature {...FeatureList[0]} />
      </div>
    </section>
  );
}
