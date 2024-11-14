import {z} from 'zod';
import {useState, useEffect} from 'react';
import {useVideoConfig, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {geoMercator, geoPath} from 'd3-geo';
import {GeoJSON, FeatureCollection, Geometry} from 'geojson';
import {evolvePath} from '@remotion/paths';

import {TitleWithSubtitle} from '../03-Page/TitleWithSubtitle/TitleWithSubtitle';
import {ThemeType} from '../../../acetti-themes/themeTypes';
import {LorenzoBertoliniLogo2} from '../../../acetti-components/LorenzoBertoliniLogo2';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../acetti-themes/getThemeFromEnum';

export const germanyBerlinPOCSchema = z.object({
	themeEnum: zThemeEnum,
});

export interface GeoJSONData {
	type: 'FeatureCollection';
	features: FeatureCollection<Geometry>;
}

export const GermanyBerlinPOC: React.FC<
	z.infer<typeof germanyBerlinPOCSchema>
> = ({themeEnum}) => {
	const theme = useThemeFromEnum(themeEnum);

	const [geoData, setGeoData] = useState<FeatureCollection<Geometry> | null>(
		null
	);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const jsonDataPath = staticFile('geoJson/4_niedrig.geo.json');

		const fetchGeoJSON = async () => {
			try {
				const response = await fetch(jsonDataPath);
				if (!response.ok) {
					throw new Error(`Error fetching GeoJSON: ${response.statusText}`);
				}
				const data = await response.json();
				setGeoData(data);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : 'An unknown error occurred'
				);
			}
		};

		fetchGeoJSON();
	}, []);

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!geoData) {
		return <div>Loading...</div>;
	}

	return <GermanyBerlin theme={theme} geoData={geoData} />;
};

export const GermanyBerlin: React.FC<{
	theme: ThemeType;
	geoData: FeatureCollection<Geometry>;
}> = ({theme, geoData}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const percAnimation = frame / (durationInFrames - 1);

	const width = 800;
	const height = 800;

	// Define a projection
	const projection = geoMercator()
		.center([10, 51.1]) // Center the projection around Germany
		.fitExtent(
			[
				[0, 0],
				[width, height],
			],
			geoData as GeoJSON
		);
	// .scale(3400) // Adjust the scale
	// .translate([width / 2, height / 2]);

	// Define a path generator
	const pathGenerator = geoPath().projection(projection);

	const path = pathGenerator(geoData.features[0]);

	const pathEvolution = path ? evolvePath(percAnimation, path) : null;

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<TitleWithSubtitle
				title="Hello title"
				subtitle="Hello subtitle"
				theme={theme}
				baseline={20}
			/>
			<Sequence layout="none" from={fps * 1.5}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
					}}
				>
					<svg
						style={{
							width,
							height,
							position: 'relative',
						}}
					>
						{path ? (
							<path
								d={path}
								{...pathEvolution}
								stroke="orange"
								fill="#303030"
								strokeWidth={4}
							/>
						) : null}
					</svg>
				</div>
			</Sequence>

			<LorenzoBertoliniLogo2 theme={theme} />
		</div>
	);
};
