import React from 'react';
import styles from './FooterTop.module.css';
import ECADSvg from '../../../static/img/ECAD_logo.svg';

const FeatureList = [
  {
    title: 'Powered by',
    url: 'https://ecadlabs.com',
  },
];

function Feature({ title, url }) {
  return (
    <div className={styles.Contentcontainer}>
      <h5 className={styles.headline}>{title}</h5>
      <a href={url}>
        <ECADSvg className={styles.footerFeatureSvg} />
      </a>
    </div>
  );
}

export default function FooterTop() {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <Feature {...FeatureList[0]} />
      </div>
    </section>
  );
}