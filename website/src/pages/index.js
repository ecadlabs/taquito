import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
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
        <div className={styles.mainContainer}>
          <Hero />
          <LogoGrid />
          <SimpleWay />
          <TitleBlock />
          <CardsGrid />
          <SimpleStep />
          <TeamsCarousel />
          <FooterTop />
        </div>
      </main>
    </Layout>
  );
};
