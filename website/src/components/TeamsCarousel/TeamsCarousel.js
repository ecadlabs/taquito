/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useRef } from 'react';
import styles from './TeamsCarousel.module.scss';
import Slider from 'react-slick';
import '../../../static/slick/slick.css';
import '../../../static/slick/slick-theme.css';
import ArrowRight from '../../../static/img/carousel-arrow-right.svg';
import ArrowLeft from '../../../static/img/carousel-arrow-left.svg';

const FeatureList = [
  {
    title: 'Teams Building With Taquito',
    // Svg: require("../../../static/img/taq_orange.svg").default,
    images: [
      {
        Image: require('../../../static/img/kolibri-logo.png').default,
        title: 'Kolibri',
        url: 'https://kolibri.finance/',
      },
      {
        Image: require('../../../static/img/sweet.png').default,
        title: 'Sweet',
        url: 'https://sweet.io/',
      },
      {
        Image: require('../../../static/img/interpop_logo.png').default,
        title: 'Interpop',
        url: 'https://www.interpop.io/',
      },
      {
        Image: require('../../../static/img/quipuswap-logo.png').default,
        title: 'QuipuSwap',
        url: 'https://quipuswap.com/',
      },
      {
        Image: require('../../../static/img/spruce_logo.png').default,
        title: 'Spruce',
        url: 'https://www.spruceid.com/',
      },
      {
        Image: require('../../../static/img/plenty.png').default,
        title: 'Plenty',
        url: 'https://www.plentydefi.com/',
      },
      {
        Image: require('../../../static/img/Kukai_logo.png').default,
        title: 'Kukai',
        url: 'https://wallet.kukai.app/',
      },
      {
        Image: require('../../../static/img/tezos_mandala.png').default,
        title: 'Tezos Mandala',
        url: 'https://tezos-mandala.art/',
      },
      {
        Image: require('../../../static/img/temple-logo.png').default,
        title: 'Temple - Tezos Wallet',
        url: 'https://templewallet.com/',
      },
      {
        Image: require('../../../static/img/tz-colors.png').default,
        title: 'tzcolors',
        url: 'https://www.tzcolors.io/',
      },
      {
        Image: require('../../../static/img/nomadic_logo.png').default,
        title: 'Nomadic Labs',
        url: 'https://www.nomadic-labs.com/',
      },
      {
        Image: require('../../../static/img/blockwatch_logo.png').default,
        title: 'Blockwatch',
        url: 'https://blockwatch.cc/blog/tag/tezos/',
      },
      {
        Image: require('../../../static/img/Group.png').default,
        title: 'Tezos Domains',
        url: 'https://tezos.domains',
      },
      {
        Image: require('../../../static/img/Ligoland_logo.png').default,
        title: 'Ligo',
        url: 'https://ligolang.org/',
      },
      {
        Image: require('../../../static/img/Vector_1.png').default,
        title: 'Homebase',
        url: 'https://tezos-homebase.io/',
      },
      {
        Image: require('../../../static/img/radion_logo.png').default,
        title: 'Radion',
        url: 'https://www.radion.fm/',
      },
      {
        Image: require('../../../static/img/stakerdao_logo.png').default,
        title: 'Staker DAO',
        url: 'https://www.stakerdao.com/',
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
            <a href={image.url} className={styles.imageContainer} target="_blank">
              <img
                src={image.Image}
                className={styles.image}
                alt={image.caption}
                title={image.title}
              />
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