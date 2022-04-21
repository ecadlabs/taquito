import React, { useState, useEffect } from 'react';
// import clsx from "clsx";
import styles from './Hero.module.scss';
// import Slider from "react-slick";

// import SVGExample from './example-logo.svg'

const FeatureList = [
  {
    title: 'Developing on Tezos can be delicious!',
    // Svg: require("./example-logo.svg").default,
    // SvgTraiangle1: require("../../../static/img/triangle1.svg").default,
    // SvgTraiangle2: require("../../../static/img/triangle2.svg").default,
    // SvgTraiangle3: require("../../../static/img/triangle3.svg").default,
    // SvgTraiangle4: require("../../../static/img/triangle4.svg").default,
    // SvgTraiangle5: require("./example-logo.svg").default,
    description: (
      <>
        Use our popular Taquito TypeScript library Taquito to develop your Tezos blockchain apps
        faster and easier
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
        gif: require('../../../static/gif/taq_hero.mp4').default,
      },
      {
        title: 'Installing the Taqueria VS Code Extension',
        // icon: require("../../../static/img/briefcase.png").default,
        description: 'Taqueria has a VS Code extension available in the marketplace',
        gif: require('../../../static/gif/taq_hero.mp4').default,
      },
    ],
  },
];

function Feature({
  // Svg,
  title,
  description,
  link,
  features,
  // SvgTraiangle1,
  // SvgTraiangle2,
  // SvgTraiangle3,
  // SvgTraiangle4,
  // SvgTraiangle5,
}) {
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
          {/* <Svg className={styles.featureSvg} alt={title} /> */}
          {/* <SvgTraiangle1 className={styles.featureSvgTraiangle1} alt={title} />
          <SvgTraiangle2 className={styles.featureSvgTraiangle2} alt={title} />
          <SvgTraiangle3 className={styles.featureSvgTraiangle3} alt={title} />
          <SvgTraiangle4 className={styles.featureSvgTraiangle4} alt={title} />
          <SvgTraiangle5 className={styles.featureSvgTraiangle5} alt={title} /> */}
        </div>
      </div>
      <div className={styles.carouselContainer}>
        <div className={styles.carousel}>
          <div className={styles.videoHeader}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className={styles.videoBlock}>
            <div className={styles.videoBlockHidden}></div>
            {features.map((feature, index) => {
              return (
                isVisible === feature.title && (
                  <video key={index} autoPlay={true} muted src={feature.gif} />
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
