import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { faLaughBeam, faSuitcase, faTools } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layout from '@theme/Layout';
import classnames from 'classnames';
import React from 'react';

import styles from './styles.module.css';

const FEATURES = [
  {
    description: 'Hit the ground running using & contributing to the library quickly: Taquito is written in an idiomatic TypeScript style, and includes a set of ready-made React components.',
    awesomeIcon: faLaughBeam,
    title: 'Easy to Use',
  },
  {
    description: 'Perfect for any JavaScript project on the front- or back-end with minimal dependencies, Taquito has no reliance on any stack by default, except the <a href="https://gitlab.com/tezos/tezos" target="_blank">Tezos Node</a>.',
    awesomeIcon: faSuitcase,
    title: 'Portable',
  },
  {
    description: 'Taquito comes complete with a well-documented API using TypeDoc, continuous integration tests against the <a href="https://gitlab.com/tezos/tezos" target="_blank">Tezos Node</a>; versioned releases published to npmjs.org.',
    awesomeIcon: faTools,
    title: 'Well-Supported',
  },
];

const USERS = [
  {
    caption: 'Tocqueville Group',
    image: '/img/tqtezos.svg',
    link: 'https://tqtezos.com',
  },
  {
    caption: 'Ligo',
    image: '/img/ligo.svg',
    link: 'https://ligolang.org/',
  },
  {
    caption: 'Truffle',
    image: '/img/truffle.png',
    link: 'https://www.trufflesuite.com/',
  },
  {
    caption: 'Nomadic Labs',
    image: '/img/nomadic.png',
    link: 'https://www.nomadic-labs.com/',
  }
];

export default () => {
  const context = useDocusaurusContext();
  const { siteConfig } = context;
  const { customFields } = siteConfig;

  return (
    <Layout permalink="/" description={customFields.description}>
      <div className={classnames(styles.banner, styles.centered, 'margin-bottom--xl')}>
        <img className={styles.brandLogo} src={useBaseUrl('img/Taquito.png')} />
        <span className={styles.tagline}>{siteConfig.tagline}</span>
        <div className={classnames('margin-bottom--lg')}>
          <Link
            className={styles.button}
            to={useBaseUrl('docs/quick_start')}>
            Quick Start
        </Link>
          <Link
            className={styles.button}
            href={'https://tezostaquito.io/typedoc'}
          >
            TypeDoc Reference
        </Link>
        </div>
        <iframe
          src="https://ghbtns.com/github-btn.html?user=ecadlabs&repo=taquito&type=star&count=true&size=large"
          frameBorder="0"
          scrolling="0"
          width="130px"
          height="30px"
        ></iframe>
      </div>
      <div className={classnames(styles.section, 'container', 'text--center', 'margin-bottom--xl')}>
        <div className="row">
          {FEATURES.map((feature, key) => (
            <div className="col" key={key}>
              <FontAwesomeIcon icon={feature.awesomeIcon} size="6x"></FontAwesomeIcon>
              <h2 className="padding-top--md">{feature.title}</h2>
              <p dangerouslySetInnerHTML={{
                __html: feature.description,
              }}></p>
            </div>
          ))}
        </div>
      </div>
      <div className={classnames(styles.section, styles.bestPractices, 'margin-bottom--xl')}>
        <div className={classnames('container', 'text--center')}>
          <div className={classnames('row', styles.centerVerticaly)}>
            <div className="col">
              <h2>Participation in CII Badging Program</h2>
              <p>The CII (Core Infrastructure Initiative) badging program was created by the Linux Foundation in response to previous security issues in open-source projects. We are committed to follow these best practices and earn/maintain our CII Badges.</p>
            </div>
            <div className="col">
              <img src={useBaseUrl('img/cii_badge.png')} />
            </div>
          </div>
        </div>
      </div>
      <div className={classnames(styles.section, 'margin-bottom--xl')}>
        <div className={classnames('container', 'text--center')}>
          <div className={classnames('row', styles.centerVerticaly)}>
            <div className="col">
              <h2>Boilerplate App</h2>
              <p>The Taquito team has created a small sample project that checks and displays XTZ balance. Developers are invited to use this as a starting point by simply forking the <a href="https://github.com/ecadlabs/taquito-boilerplate">Taquito Boilerplate</a> project in GitHub.</p>
            </div>
            <div className="col">
              <img src={useBaseUrl('img/boilerplate_screenshot.png')} />
            </div>
          </div>
        </div>
      </div>
      <div className={classnames(styles.section, styles.bestPractices)}>
        <div className={classnames('container', 'text--center')}>
          <div className={classnames('row')}>
            <div className="col">
              <h2>Teams Building on Taquito</h2>
            </div>
          </div>
          <div className={classnames('row', 'padding-top--lg', styles.centerVerticaly)}>
            {USERS.map((user, key) => (
              <div className={classnames('col', 'padding-bottom--md')}>
                <a href={user.link} key={key} rel="noopener noreferrer" target="_blank">
                  <img className={classnames(styles.userBanner)} src={useBaseUrl(user.image)} alt={user.caption} title={user.caption} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
