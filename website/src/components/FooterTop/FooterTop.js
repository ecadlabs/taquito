import React from 'react';
import clsx from 'clsx';
import styles from './FooterTop.module.css';
import ECADSvg from '../../../static/img/ECAD_logo.svg';

const FeatureList = [
  {
    title: 'Powered by',
    url: 'https://tezos-homebase.herokuapp.com/explorer/daos',
  },
];

function Feature({ title, url, image }) {
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
