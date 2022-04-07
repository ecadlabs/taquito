import React from "react";
import clsx from "clsx";
import styles from "./FooterTop.module.css";

const FeatureList = [
	{
    title: 'Powered by',
    image: "../../../static/img/ECAD_logo.svg",
    url: 'https://tezos-homebase.herokuapp.com/explorer/daos', 
  },
	,
];

function Feature({ title, url,image }) {
	return (
		<div className={styles.Contentcontainer}>
			<h5 className={styles.headline}>{title}</h5>
			<a href={url}>
				<img className={styles.featureSvg} alt={title} src={image} />
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
