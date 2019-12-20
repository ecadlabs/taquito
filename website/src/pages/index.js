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

export default () => {
  const context = useDocusaurusContext();
  const { siteConfig } = context;
  const { customFields } = siteConfig;

  return (
    <Layout permalink="/" description={customFields.description}>
      <div className={classnames(styles.banner, 'margin-bottom--xl')}>
        <img className={styles.brandLogo} src={useBaseUrl('img/Taquito.png')} />
        <span className={styles.tagline}>{siteConfig.tagline}</span>
        <Link
          className={styles.quickStartButton}
          to={useBaseUrl('docs/quick_start')}>
          Quick Start
        </Link>
      </div>
      <div className={classnames(styles.section, 'container', 'text--center', 'margin-bottom--xl')}>
        <div className="row">
          {FEATURES.map((feature, key) => (
            <div className="col" key={key}>
              <FontAwesomeIcon icon={feature.awesomeIcon} size="6x"></FontAwesomeIcon>
              <h2 className="padding-top--md">{feature.title}</h2>
              <p className="padding-horiz--md" dangerouslySetInnerHTML={{
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
              <h2 className="padding-top--md">Participation in CII Badging Program</h2>
              <p className="padding-horiz--md">The CII (Core Infrastructure Initiative) badging program was created by the Linux Foundation in response to previous security issues in open-source projects. We are committed to follow these best practices and earn/maintain our CII Badges.</p>
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
              <h2 className="padding-top--md">Boilerplate App</h2>
              <p className="padding-horiz--md">The Taquito team has created a small sample project that checks and displays XTZ balance. Developers are invited to use this as a starting point by simply forking the <a href="https://github.com/ecadlabs/taquito-boilerplate">Taquito Boilerplate</a> project in GitHub.</p>
            </div>
            <div className="col">
              <img src={useBaseUrl('img/boilerplate_screenshot.png')} />
            </div>
          </div>
        </div>
      </div>
      <div className={classnames(styles.section, styles.bestPractices)}>
        <div className={classnames('container', 'text--center')}>
          <div className={classnames('row', styles.centerVerticaly)}>
            <div className="col">
              <h2 className="padding-top--md">Participation in CII Badging Program</h2>
              <p className="padding-horiz--md">The CII (Core Infrastructure Initiative) badging program was created by the Linux Foundation in response to previous security issues in open-source projects. We are committed to follow these best practices and earn/maintain our CII Badges.</p>
            </div>
            <div className="col">
              <img src={useBaseUrl('img/cii_badge.png')} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
