import React, {useRef, useEffect, useState} from 'react';
import {continueRender, delayRender, useVideoConfig} from 'remotion';
import {z} from 'zod';

import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {SimpleBarChart} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
// import {EconomistDataSource} from '../EconomistDataSource';
// import {LorenzoBertoliniLogo2} from '../../../../acetti-components/LorenzoBertoliniLogo2';
import {CapSizeTextNew} from '../../../../acetti-typography/CapSizeTextNew';
import {EconomistTitleWithSubtitle} from '../EconomistTitleWithSubtitle';
import {useFontFamiliesLoader} from '../../../../acetti-typography/useFontFamiliesLoader';
import {getBarChartBaseline} from '../../../../acetti-flics/SimpleBarChart/useBarChartLayout';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';

export const simpleBarChartPerfectSizingCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

function formatPercentage(value: number): string {
	return (
		(value * 100).toLocaleString(undefined, {
			minimumFractionDigits: 1,
			maximumFractionDigits: 1,
		}) + '%'
	);
}
// Example usage:
// console.log(formatPercentage(0.12)); // Output: "12.0%"

const wahlergebnis2024: {
	parteiName: string;
	prozent: number;
	farbe: string;
	id: string;
}[] = [
	{parteiName: 'SPD', prozent: 30.9 / 100, farbe: '#E3000F', id: 'SPD'}, // SPD Red
	{parteiName: 'AfD', prozent: 29.2 / 100, farbe: '#009EE0', id: 'AFD'}, // AfD Blue
	{parteiName: 'BSW', prozent: 13.5 / 100, farbe: '#FFA500', id: 'BSW'}, // BSW Orange (aligned with Sahra Wagenknecht's movement)
	// {parteiName: 'CDU', prozent: 12.1 / 100, farbe: '#000000'}, // CDU Black
	{parteiName: 'CDU', prozent: 12.1 / 100, farbe: '#fff', id: 'CDU'}, // CDU Black
	{parteiName: 'Grüne', prozent: 4.1 / 100, farbe: '#64A12D', id: 'GRU'}, // Grüne Green
	{parteiName: 'Die Linke', prozent: 3.0 / 100, farbe: '#BE3075', id: 'LIN'}, // Die Linke Magenta
	{
		parteiName: 'BVB/Freie Wähler',
		prozent: 2.6 / 100,
		farbe: '#FFD700',
		id: 'BVB',
	}, // BVB Yellow
	{parteiName: 'FDP', prozent: 0.8 / 100, farbe: '#FFED00', id: 'FDP'}, // FDP Yellow
	{parteiName: 'Sonstige', prozent: 4.6 / 100, farbe: '#808080', id: 'SON'}, // Others Gray
];

export const SimpleBarChartPerfectSizingComposition: React.FC<
	z.infer<typeof simpleBarChartPerfectSizingCompositionSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	const {width} = useVideoConfig();

	// Create a ref to the div you want to measure
	const divRef = useRef<HTMLDivElement>(null);

	// const scale = useCurrentScale();
	// const scale = 1;

	// State to store dimensions
	const [dimensions, setDimensions] = useState<{
		width: number;
		height: number;
	} | null>(null);

	// Handle to delay rendering
	const [handle] = useState(() => delayRender());

	useEffect(() => {
		const measure = async () => {
			// ***********************************************************
			// TODO bring these waiting checks into the fonts loader!!!!!
			// ***********************************************************
			// await for when the fonts are loaded in the browser
			await document.fonts.ready;

			// Introduce an additional delay to ensure styles are applied
			await new Promise((resolve) => setTimeout(resolve, 2000));
			// ***********************************************************

			if (divRef.current) {
				const {offsetWidth, offsetHeight} = divRef.current;
				setDimensions({width: offsetWidth, height: offsetHeight});
				// Once measurement is done, continue rendering
				continueRender(handle);
			}
		};

		// Measure after the component has mounted and rendered
		measure();

		// Optionally, add a resize listener if dimensions might change
		// window.addEventListener('resize', measure);

		// Cleanup on unmount
		return () => {
			// window.removeEventListener('resize', measure);
		};
	}, [handle]);

	// TODO utilize the page settings for baseline and page margins
	const CHART_WIDTH = width - 4 * 18;

	// load fonts
	// ********************************************************
	useFontFamiliesLoader(theme);

	const barChartData = wahlergebnis2024.map((it) => ({
		label: it.parteiName,
		value: it.prozent,
		id: it.id,
		// barColor: it.farbe,
		// barColor: '#fff',
		// barColor: '#f05122',
		barColor: '#FF396E',
		valueLabel: formatPercentage(it.prozent),
	}));

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
				}}
			>
				<div>
					<EconomistTitleWithSubtitle
						// title={'AfD: Vormarsch in Brandenburg'}
						// title={'AfD: Vormarsch in Brandenburg mit eigenen Feuerwerkskoerpern'}
						title={
							'AfD: Vormarsch in Brandenburg mit eigenen Feuerwerkskoerpern. Wer will ne jute Curreywurst??'
						}
						subtitle={'Wahlergebnisse Brandenburg 2024'}
						theme={theme}
					/>
				</div>

				<div
					ref={divRef}
					style={{
						flex: 1,
						display: 'flex',
						justifyContent: 'center',
					}}
				>
					{dimensions && (
						<div>
							<SimpleBarChart
								data={barChartData}
								width={CHART_WIDTH}
								// showLayout
								baseline={getBarChartBaseline(dimensions.height, barChartData)}
								theme={theme}
							/>
						</div>
					)}
				</div>

				<FooterDiv baseline={18}>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'flex-end',
						}}
					>
						<div style={{maxWidth: '62%'}}>
							<TypographyStyle
								typographyStyle={theme.typography.textStyles.dataSource}
								baseline={18}
							>
								Data Source: German Bundesbank 2024 Paper on Evolutional Finance
							</TypographyStyle>
						</div>

						<LorenzoBertoliniLogo
							baseline={18}
							capHeightInBaselines={1.5}
							theme={theme}
						/>
					</div>
				</FooterDiv>
			</div>
		</div>
	);
};

export const FooterDiv: React.FC<{
	children: React.ReactNode;
	baseline: number;
}> = ({children, baseline}) => {
	const paddingTop = 3 * baseline;

	const pageMarginLeft = baseline * 2;
	const pageMarginRight = baseline * 2;
	const pageMarginBottom = baseline * 2;

	return (
		<div
			style={{
				marginLeft: pageMarginLeft,
				marginRight: pageMarginRight,
				marginBottom: pageMarginBottom,
				paddingTop,
				// backgroundColor: '#222',
			}}
		>
			{children}
		</div>
	);
};

export const LorenzoBertoliniLogo = ({
	theme,
	color: colorProp,
	baseline,
	capHeightInBaselines = 1,
}: {
	theme: ThemeType;
	color?: string;
	capHeightInBaselines?: number;
	baseline: number;
}) => {
	const color = colorProp || theme.typography.logoColor;
	const capHeight = baseline * capHeightInBaselines;

	// return (
	// 	<div style={{display: 'block'}}>
	// 		<CapSizeTextNew
	// 			fontFamily={'Inter-Regular'}
	// 			capHeight={capHeight}
	// 			lineGap={0}
	// 			color={color}
	// 			as="div"
	// 			// style={{display: 'inline-block'}}
	// 		>
	// 			lorenzo
	// 		</CapSizeTextNew>
	// 		<CapSizeTextNew
	// 			fontFamily={'Inter-Bold'}
	// 			capHeight={capHeight}
	// 			lineGap={0}
	// 			color={color}
	// 			as="div"
	// 			// style={{display: 'inline-block'}}
	// 		>
	// 			bertolini
	// 		</CapSizeTextNew>
	// 	</div>
	// );

	return (
		<div>
			<CapSizeTextNew
				fontFamily={'Inter-Regular'}
				capHeight={capHeight}
				lineGap={0}
				color={color}
			>
				<span>lorenzo</span>
				<span style={{fontFamily: 'Inter-Bold'}}>bertolini</span>
			</CapSizeTextNew>
		</div>
	);
};
