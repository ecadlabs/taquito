import React from 'react';
import styles from './Hero.module.scss';
import Slider from 'react-slick';
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
        title: 'Installing the Taqueri CLI',
        // icon: 'require("../../../static/img/briefcase.png").default',
        description: 'Installing the Taqueria is easy',
        gif: require('../../../static/img/hero-00.png').default,
      },
      {
        title: 'Installing the Taqueria VS Code Extension',
        // icon: require("../../../static/img/briefcase.png").default,
        description: 'Taqueria has a VS Code extension available in the marketplace',
        gif: require('../../../static/img/hero-0.png').default,
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
