/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import styles from './Hero.module.scss';
import Slider from 'react-slick';
import '../../../static/slick/slick.css';
import '../../../static/slick/slick-theme.css';
import GetStartedButton from '../GetStartedButton/GetStartedButton';

const FeatureList = [
  {
    title: 'Developing on Tezos can be delicious!',
    description: (
      <>
        Use our popular Taquito TypeScript library to develop your Tezos blockchain apps faster and
        easier
      </>
    ),
    features: [
      {
        gif: require('../../../static/img/hero-00.png').default,
      },
      {
        gif: require('../../../static/img/hero-0.png').default,
      },
    ],
  },
];

function Feature({ title, description, features }) {
  const sliderSettings = {
    arrows: false,
    dots: true,
    infinite: true,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    dotsClass: 'slick-dots slick-thumb',
    autoplaySpeed: 7000,
  };

  return (
    <div className={styles.content}>
      <div className={styles.heroCardContainer}>
        <div className={styles.heroCard}>
          <h1 className={styles.heroTitle}>{title}</h1>
          <div className={styles.heroCardContent}>
            <p className={styles.heroCardDescription}>{description}</p>
            <GetStartedButton />
          </div>
        </div>
      </div>
      <div className={styles.carouselContainer}>
        <div className={styles.carouselBox}>
          <Slider className={styles.slider} {...sliderSettings}>
            {features.map((feature, index) => (
              <img key={index} src={feature.gif} />
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <Feature {...FeatureList[0]} />
      </div>
    </section>
  );
}