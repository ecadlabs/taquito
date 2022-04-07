import React from 'react';
import clsx from 'clsx';
import styles from './FooterTop.module.css';
import SVG from '../../../static/img/ECAD_logo.svg';
const FeatureList = [
  {
    title: 'Powered by',
    Svg: require('../../../static/img/ECAD_logo.svg').default,
    url: 'https://ecadlabs.com/',
  },
];

function Feature({ title, url, image }) {
  return (
    <div className={styles.Contentcontainer}>
      <h5 className={styles.headline}>{title}</h5>
      <a href={url}>
        <SVG className={styles.featureSvg} alt={title} />
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
