import React, { useRef } from 'react';
import clsx from 'clsx';
import styles from './TeamsCarousel.module.scss';
import Slider from 'react-slick';
import '../../../static/slick/slick.css';
import '../../../static/slick/slick-theme.css';
import ArrowRight from '../../../static/img/carousel-arrow-right.svg';
import ArrowLeft from '../../../static/img/carousel-arrow-left.svg';

const FeatureList = [
  {
    title: 'Teams building with Taqueria',
    // Svg: require("../../../static/img/taq_orange.svg").default,
    images: [
      {
        Image: require('../../../static/img/example.png').default,
        title: 'Boosts Productivity',
        url: '/docs/quick_start',
      },
      {
        Image: require('../../../static/img/example.png').default,
        title: 'Improves Quality',
        url: '/docs/quick_start',
      },
      {
        Image: require('../../../static/img/example.png').default,
        title: 'Easy Integration',
        url: '/docs/quick_start',
      },
      {
        Image: require('../../../static/img/example.png').default,
        title: 'Boosts Productivity',
        url: '/docs/quick_start',
      },
      {
        Image: require('../../../static/img/example.png').default,
        title: 'Improves Quality',
        url: '/docs/quick_start',
      },
      {
        Image: require('../../../static/img/example.png').default,
        title: 'Easy Integration',
        url: '/docs/quick_start',
      },
      {
        Image: require('../../../static/img/example.png').default,
        title: 'Boosts Productivity',
        url: '/docs/quick_start',
      },
      {
        Image: require('../../../static/img/example.png').default,
        title: 'Improves Quality',
        url: '/docs/quick_start',
      },
      {
        Image: require('../../../static/img/example.png').default,
        title: 'Easy Integration',
        url: '/docs/quick_start',
      },
    ],
  },
];

function Feature({ images, title }) {
  const sliderSettings = {
    arrows: false,
    dots: false,
    infinite: true,
    autoplay: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        },
      },
      // {
      //   breakpoint: 1024,
      //   settings: {
      //     slidesToShow: 3,
      //   },
      // },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  const sliderRef = useRef();

  const nextSlide = () => {
    sliderRef.current.slickNext();
  };
  const prevSlide = () => {
    sliderRef.current.slickPrev();
  };
  return (
    <div className={styles.teams}>
      <h2 className={styles.teamsTitle}>{title}</h2>
      <div className={styles.arrowLeftContainer}>
        <ArrowLeft onClick={prevSlide} className={styles.arrowLeft} />
      </div>
      <Slider className={styles.slider} {...sliderSettings} ref={sliderRef}>
        {images.map((image, idx) => (
          <div key={idx}>
            <a href={image.url} className={styles.imageContainer}>
              <img src={image.Image} className={styles.image} alt="" />
            </a>
          </div>
        ))}
      </Slider>
      <div className={styles.arrowRightContainer}>
        <ArrowRight onClick={nextSlide} className={styles.arrowRight} />
      </div>
    </div>
  );
}

export default function TeamsCarousel() {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <Feature {...FeatureList[0]} />
      </div>
    </section>
  );
}
