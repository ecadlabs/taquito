import React from 'react';
import clsx from 'clsx';
import styles from './LogoGrid.module.scss';

const FeatureList = [
  {
    // title: "Teams building with Taqueria",
    // Svg: require("../../../static/img/taq_orange.svg").default,
    images: [
      {
        icon: require('../../../static/img/spaceship-svg.svg').default,
        title: 'Boosts Productivity',
        url: '/docs/quick_start',
      },
      {
        icon: require('../../../static/img/logo-t.svg').default,
        title: 'Improves Quality',
        url: '/docs/quick_start',
      },
      {
        icon: require('../../../static/img/tool-svg.svg').default,
        title: 'Easy Integration',
        url: '/docs/quick_start',
      },
    ],
  },
];

function Feature({ images }) {
  return (
    <div className={styles.logos}>
      {images.map((image, idx) => (
        <span key={idx} className={styles.image}>
          <div className={styles.logoContainer}>
            {/* <SpaceShip /> */}
            {/* <img src={image.Image} alt="" /> */}
            <image.icon className={styles.cardSvg} alt={image.title} />
          </div>
          <a className={styles.link} href={image.url}>
            {image.title}
          </a>
        </span>
      ))}
    </div>
  );
}

export default function LogoGrid() {
  return (
    <section className={styles.features}>
      <Feature {...FeatureList[0]} />
    </section>
  );
}
