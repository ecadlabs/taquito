/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './Hero.module.scss';
import '../../../static/slick/slick.css';
import '../../../static/slick/slick-theme.css';

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
        title: 'Example of intializing a Beacon wallet with Taquito',
        image: require('../../../static/img/hero-1.png').default,
      },
      {
        title: 'Example of transferring an NFT with Taquito',
        image: require('../../../static/img/hero-2.png').default,
      },
    ],
  },
];

function Feature({ title, description, link, features }) {
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

    // customPaging: () => (
    //   <div style={{ marginTop: '100px' }}>
    //     <div
    //       style={{
    //         height: '6px',
    //         width: '6px',
    //         background: 'red',
    //         // borderRadius: '100%',
    //         // backgroundColor: theme.colors.textLightGray,
    //       }}
    //     />
    //   </div>
    // ),
  };

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
        <div className={styles.carouselBox}>
          <BrowserOnly fallback={<div>Loading...</div>}>
            {() => {
              const Slider = require('react-slick').default;
              return (
                <Slider className={styles.slider} {...sliderSettings}>
                  {features.map((feature, index) => (
                    <img key={index} src={feature.image} alt={feature.title} />
                  ))}
                </Slider>
              );
            }}
          </BrowserOnly>
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