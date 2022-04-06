import React from "react";
import clsx from "clsx";
import styles from "./LogoGrid.module.css";

const FeatureList = [
	{
		// title: "Teams building with Taqueria",
		// Svg: require("../../../static/img/taq_orange.svg").default,
		images: [
			{
				Image: require("../../../static/img/example.png").default,
				title: 'Boosts Productivity',
				 url: "/docs/quick_start",
			},
			{
				Image: require("../../../static/img/example.png").default,
				title: 'Improves Quality',
				 url: "/docs/quick_start",
			},
			{
				Image: require("../../../static/img/example.png").default,
				title: 'Easy Integration',
				 url: "/docs/quick_start",
			},

		],
	},
];

function Feature({ images }) {
	return (
			<div className={styles.logos}>
					{images.map((image, idx) => (
						<span key={idx} className={styles.image}>
							<img src={image.Image} alt="" />
							<a className={styles.link} href={image.url}>
							{image.title}
							</a>
						</span>
					))}
			</div>
	);
}

export default function LogoGrid() {
	return (
		<section className={styles.features}>
					<Feature {...FeatureList[0]} />			
		</section>
	);
}
