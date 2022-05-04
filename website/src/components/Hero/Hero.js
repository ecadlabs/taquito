import React, { useState, useEffect } from 'react';
// import clsx from "clsx";
import styles from './Hero.module.scss';
// import Slider from "react-slick";

// import SVGExample from './example-logo.svg'

const FeatureList = [
  {
    title: 'Developing on Tezos can be delicious!',
    description: (
      <>
        Use our popular Taquito TypeScript library to develop your Tezos blockchain apps faster and
        easier
      </>
    ),
    link: {
      title: 'Get Started',
      url: '/docs/quick_start',
    },

    logoImages: [
      {
        logo: require('../../../static/img/example.png').default,
        link: {
          title: 'Get Started',
          url: '/docs/quick_start',
        },
      },
      {
        logo: require('../../../static/img/example.png').default,
        link: {
          title: 'Get Started',
          url: '/docs/quick_start',
        },
      },
      {
        logo: require('../../../static/img/example.png').default,
        link: {
          title: 'Get Started',
          url: '/docs/quick_start',
        },
      },
    ],
    features: [
      {
        title: 'Installing the Taqueri CLI',
        // icon: 'require("../../../static/img/briefcase.png").default',
        description: 'Installing the Taqueria is easy',
        gif: require('../../../static/img/taquito_code_hero_1.png').default,
      },
      {
        title: 'Installing the Taqueria VS Code Extension',
        // icon: require("../../../static/img/briefcase.png").default,
        description: 'Taqueria has a VS Code extension available in the marketplace',
        gif: require('../../../static/img/taquito_code_hero_2.png').default,
      },
    ],
  },
];

function Feature({ title, description, link, features }) {
  const checkTitle = (e) => {
    setUserAction(true);
    isVisible === e.target.id
      ? toggleIsVisible(`${features[0].title}`)
      : toggleIsVisible(e.target.id);
  };

  const [isVisible, toggleIsVisible] = useState(`${features[0].title}`);
  const [userAction, setUserAction] = useState(false);

  const featuresIndex = features.findIndex((object) => {
    return object.title === isVisible;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const checkEnd = (index) => {
        return features.length - 1 === index ? index * 0 : index + 1;
      };

      !userAction && toggleIsVisible(`${features[checkEnd(featuresIndex)].title}`);
    }, 10000);
    return () => clearInterval(interval);
  }, [isVisible, userAction]);

  return (
    <div className={styles.content}>
      <div className={styles.heroCardContainer}>
        <div className={styles.heroCard}>
          <h1 className={styles.heroTitle}>{title}</h1>
          <div className={styles.heroCardContent}>
            <p className={styles.heroCardDescription}>{description}</p>
            <div className={styles.heroButtonContainer}>
              <a className={styles.heroButton} href={link.url}>
                {link.title}
              </a>
            </div>
            {link.tilte}
          </div>
        </div>
      </div>
      <div className={styles.carouselContainer}>
        <div className={styles.carousel}>
          <div className={styles.videoBlock}>
            <div className={styles.videoBlockHidden}></div>
            {features.map((feature, index) => {
              return (
                isVisible === feature.title && (
                  <img key={index} autoPlay={true} muted src={feature.gif} />
                )
              );
            })}
          </div>
        </div>
        <div className={styles.dotMenu}>
          {features.map((feature, index) => {
            return (
              <div
                key={index}
                className={isVisible === feature.title ? styles.dots : styles.inactivedots}
                id={feature.title}
                onClick={(e) => checkTitle(e)}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const Logo = require('../../../static/img/example.png').default;

  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <Feature {...FeatureList[0]} />
      </div>
      {/* <div className={styles.leftPurpleLine}></div>
      <div className={styles.rightPurpleLine}></div> */}
    </section>
  );
}
