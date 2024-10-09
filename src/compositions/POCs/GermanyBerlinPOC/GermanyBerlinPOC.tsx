import {z} from 'zod';
import {useState, useEffect} from 'react';
import {useVideoConfig, Sequence, staticFile} from 'remotion';
import {geoMercator, geoPath} from 'd3-geo'; // Import from d3-geo
// import {ExtendedFeatureCollection}
import {
	GeoJSON,
	Feature,
	GeoJsonObject,
	FeatureCollection,
	Geometry,
} from 'geojson';

import {ThemeType} from '../../../acetti-themes/themeTypes';
import LorenzoBertoliniLogo from '../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../acetti-themes/getThemeFromEnum';
import {FadeInAndOutText} from '../../SimpleStats/FadeInAndOutText';
import {BaselineGrid} from '../CapsizeTrimmingPOC/BaselineGrid';
import {useMatrixLayout} from '../../../acetti-layout/hooks/useMatrixLayout';
import {DisplayGridRails} from '../../../acetti-layout';
import {SlideTitle} from './SlideTitle';
// TODO factor out and deprecate it's second copy:
// import {ElementsLogo} from '../CapsizeTrimmingPOC/ElementsLogo';

export const germanyBerlinPOCSchema = z.object({
	themeEnum: zThemeEnum,
});

// export interface GeoJSONFeature {
// 	type: 'Feature';
// 	geometry: {
// 		type:
// 			| 'Point'
// 			| 'LineString'
// 			| 'Polygon'
// 			| 'MultiPoint'
// 			| 'MultiLineString'
// 			| 'MultiPolygon';
// 		coordinates: number[][] | number[][][] | number[][][][];
// 	};
// 	properties: Record<string, any>; // Adjust this based on your expected properties
// }

export interface GeoJSONData {
	type: 'FeatureCollection';
	features: FeatureCollection<Geometry>;
}

export const GermanyBerlinPOC: React.FC<
	z.infer<typeof germanyBerlinPOCSchema>
> = ({themeEnum}) => {
	// TODO load Inter fonts
	const theme = getThemeFromEnum(themeEnum as any);

	// const [geoData, setGeoData] = useState<GeoJSONData | null>(null);
	const [geoData, setGeoData] = useState<FeatureCollection<Geometry> | null>(
		null
	);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const jsonDataPath = staticFile(`4_niedrig.geo.json`);

		// const parsedJsonData = JSON.parse(jsonData);
		console.log({jsonDataPath});

		const fetchGeoJSON = async () => {
			try {
				// const response = await fetch('/static-e20a4f1f22a0/4_niedrig.geo.json');
				const response = await fetch(jsonDataPath);
				if (!response.ok) {
					throw new Error(`Error fetching GeoJSON: ${response.statusText}`);
				}
				// const data: GeoJSONData = await response.json();
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

	// Render or process your GeoJSON data as needed
	return (
		// // <div>
		// 	{/* <h2>GeoJSON Loaded</h2> */}
		// 	{/* <pre>{JSON.stringify(geoData, null, 2)}</pre> */}
		// 	{/* <div> */}
		<GermanyBerlin theme={theme} geoData={geoData} />
		// 	{/* </div> */}
		// {/* </div> */}
	);
};

export const GermanyBerlin: React.FC<{
	theme: ThemeType;
	geoData: FeatureCollection<Geometry>;
	// geoData: GeoJSON;
}> = ({theme, geoData}) => {
	const {fps} = useVideoConfig();

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
	// .scale(30000) // Adjust the scale
	// .scale(3400) // Adjust the scale
	// .translate([width / 2, height / 2]);

	// Define a path generator
	const pathGenerator = geoPath().projection(projection);
	// TODO load async somehow:
	// https://raw.githubusercontent.com/datasets/geo-boundaries/master/countries/DEU.geojson

	// const path = pathGenerator(geoData.features[0] as any);
	// const path = pathGenerator(geoData.features[0] as any);
	const path = pathGenerator(geoData.features[0]);

	console.log({path});
	console.log({geoData});
	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				// backgroundColor: 'red',
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			{/* <div style={{color: 'white'}}>hello</div> */}
			<SlideTitle theme={theme}>Germany Berlin Geo Map</SlideTitle>
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
							// backgroundColor: '#555',
							position: 'relative',
						}}
					>
						{path ? (
							<path
								d={path}
								stroke="orange"
								// fill="transparent"
								fill="#303030"
								strokeWidth={4}
							/>
						) : null}
					</svg>
				</div>
			</Sequence>

			<LorenzoBertoliniLogo color={theme.typography.textColor} fontSize={34} />
		</div>
	);
};
