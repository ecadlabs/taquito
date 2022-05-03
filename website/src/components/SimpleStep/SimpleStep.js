import React from 'react';
import clsx from 'clsx';
import styles from './SimpleStep.module.scss';

const FeatureList = [
  {
    title: 'Start Simple With Taquito',
    description: 'Just a few simple steps and you are set to start building your own app.',
    link: {
      title: 'Start Now',
      url: '/docs/quick_start',
    },

    steps: [
      {
        icon: require('../../../static/img/download.svg').default,
        title: 'Install Taquito',
        description: 'Follow our QuickStart guide to start using Taquito and check code examples.',
      },
      {
        icon: require('../../../static/img/systems.svg').default,
        title: 'Create and run your first app locally',
        description: 'Use our Taquito React Boilerplate app template.',
      },
      {
        icon: require('../../../static/img/app.svg').default,
        title: 'Build your App',
        description: 'Use Taquito to connect your app to the Tezos blockchain.',
      },
    ],
  },
];

function Feature({ title, steps, link, description }) {
  return (
    <div className={styles.content}>
      <div className={styles.simpleStepsContainer}>
        <div className={styles.simpleStepsTitleContainer}>
          <h1 className={styles.simpleStepsTitle}>{title}</h1>
          <p className={styles.simpleStepsDescription}>{description}</p>
          <a className={styles.simpleStepsButton} href={link.url}>
            {link.title}
          </a>
        </div>
        <div className={styles.steps}>
          {steps.map((step, idx) => (
            <div
              className={idx % 2 === 0 ? styles.stepContainerLeft : styles.stepContainerRight}
              key={idx}
            >
              <div className={styles.stepBox}>
                <div className={styles.svgContainer}>
                  <div className={styles.stepSvg}>
                    <step.icon alt={step.title} />
                  </div>
                  <span className={idx === 0 ? styles.stepNumberFirst : styles.stepNumber}>{`${
                    idx + 1
                  }.`}</span>
                </div>
                <div className={styles.textContainer}>
                  <h4 className={styles.stepTitle}>{step.title}</h4>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SimpleStep() {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <Feature {...FeatureList[0]} />
      </div>
    </section>
  );
}
