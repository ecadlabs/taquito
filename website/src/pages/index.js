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
import { useEffect } from 'react';

export default () => {
  const context = useDocusaurusContext();
  const { siteConfig } = context;
  const { customFields } = siteConfig;

  useEffect(async () => {
    console.log('Hello, World');
    const s = document.createElement('script');
      s.src = 'https://cdn.platform.openai.com/deployments/chatkit/chatkit.js';
      s.async = true;
      s.dataset.chatkit = '1';
      s.onload = () => {
        console.log('Chatkit loaded');
        console.log(window);
      };
      document.body.appendChild(s);



      const chatkit = document.getElementById('chatkit-container');

  chatkit.setOptions({
    api: {
      async getClientSecret(currentClientSecret) {
        if (!currentClientSecret) {
          const res = await fetch('/api/chatkit/start', { method: 'POST' })
          const {client_secret} = await res.json();
          return client_secret
        }
        const res = await fetch('/api/chatkit/refresh', {
          method: 'POST',
          body: JSON.stringify({ currentClientSecret }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const {client_secret} = await res.json();
        return client_secret
      }
    },
  });

  }, []);

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      permalink="/"
      description={customFields.description}
    >
      <main>
        <div className={styles.mainContainer}>
          <div id="chatkit-container" style={{ height: '100px', backgroundColor: 'gray'}}>Hello, World</div>
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
