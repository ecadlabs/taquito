import React from 'react';
import clsx from 'clsx';
import styles from './CardsGrid.module.scss';

const FeatureList = [
  {
    title: 'This is what makes Taquito so amazing.',
    link: {
      title: 'Get Started',
      url: '/docs/quick_start',
      text: 'Ready to start?',
    },

    cards: [
      {
        icon: require('../../../static/img/briefcase.svg').default,
        title: 'Easy to use',
        description:
          "Abstractions around the Tezos blockchain are simple to understand and easy to use. Taquito's abstractions make working with contracts feel like working with plain old JavaScript objects.",
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
          'Taquito has a well-documented API, runs continuous integration tests against the Tezos Node and a set of Beacon wallets. Join out vibrant developer community in Telegram and Slack.',
      },
    ],
  },
];

function Feature({ title, cards, link }) {
  return (
    <div className={styles.content}>
      <div className={styles.cardsGridContainer}>
        <div className={styles.cardsGridTitleContainer}>
          <h1 className={styles.cardsGridTitle}>{title}</h1>
          <a className={styles.cardsButton} href={link.url}>
            {link.title}
          </a>
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
