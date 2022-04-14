import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { faLaughBeam, faSuitcase, faTools } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layout from '@theme/Layout';
import classnames from 'classnames';
import React from 'react';
import CardsGrid from '../components/CardsGrid/CardsGrid';
import FooterTop from '../components/FooterTop/FooterTop';
import Hero from '../components/Hero/Hero';
import LogoGrid from '../components/Logos/LogoGrid';
import SimpleStep from '../components/SimpleStep/SimpleStep';
import SimpleWay from '../components/SimpleWay/SimpleWay';
import TitleBlock from '../components/TitleBlock/TitleBlock';
import TeamsCarousel from '../components/TeamsCarousel/TeamsCarousel';
import styles from './styles.module.scss';

const FeatureList = [
  {
    link: {
      title: 'Get Started',
      url: '/docs/quick_start',
      text: 'Ready to start?',
    },
  },
];

function Feature({ link }) {
  return (
    <div className={styles.waysButtonContainer}>
      <h6 className={styles.waysButtonText}>{link.text}</h6>
      <a className={styles.waysButton} href={link.url}>
        {link.title}
      </a>
    </div>
  );
}


export default () => {
  const context = useDocusaurusContext();
  const { siteConfig } = context;
  const { customFields } = siteConfig;

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      permalink="/"
      description={customFields.description}
    >
      <main>
        <Hero />
        <LogoGrid />
        <SimpleWay />
        <TitleBlock />
        <CardsGrid />
        <SimpleStep />
        <TeamsCarousel />
        <FooterTop />
        <div className={styles.mainButtonSticky}>
          <Feature {...FeatureList[0]} />
        </div>
      </main>
        </Layout>
  );
};
