import {z} from 'zod';
import React from 'react';
import {useVideoConfig, Sequence} from 'remotion';

import {getHorizontalBarWithLabelAndValue} from './packages/BarChartAnimation/BarsTransition/HorizontalBarWithLabelAndValue';
import {colorPalettes} from '../../../../acetti-themes/tailwindPalettes';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {Page} from '../../../../acetti-components/Page';
import {PageContext} from '../../../../acetti-components/PageContext';
import {SimpleBarChart} from './components/SimpleBarChart';
import {getImageLabelComponent} from './packages/BarChartAnimation/BarsTransition/getImageLabelComponent';
import {getImageValueLabelComponent} from './packages/BarChartAnimation/BarsTransition/getImageValueLabelComponent';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';

const imageMappings: {[id: string]: string} = {
	'Id-001':
		'https://s3.eu-central-1.amazonaws.com/dataflics.com/countryIcons/canada-flag-circular-1024.png',
	'Id-002':
		'https://s3.eu-central-1.amazonaws.com/dataflics.com/countryIcons/uk-flag-circular-1024.png',
	'Id-003':
		'https://s3.eu-central-1.amazonaws.com/dataflics.com/countryIcons/canada-flag-circular-1024.png',
	'Id-004':
		'https://s3.eu-central-1.amazonaws.com/dataflics.com/countryIcons/canada-flag-circular-1024.png',
	'Id-005':
		'https://s3.eu-central-1.amazonaws.com/dataflics.com/countryIcons/canada-flag-circular-1024.png',
	'Id-006':
		'https://s3.eu-central-1.amazonaws.com/dataflics.com/countryIcons/canada-flag-circular-1024.png',
};

const ImageLabelComponent = getImageLabelComponent({
	imageMappings,
});

const ImageValueLabelComponent = getImageValueLabelComponent({
	imageMappings,
	numberFormatter: formatPercentage,
});

const HorizontalBarCustomComponent = getHorizontalBarWithLabelAndValue({
	valueLabelFormatter: formatPercentage,
});

// TODO pass in from outside
function formatPercentage(value: number): string {
	// Add a + sign for positive values, keep the sign for negative values
	const sign = value > 0 ? '+' : '';
	// Format the number with two decimal places and append %
	// return `${sign}${(value * 100).toFixed(2)}%`;
	return `${sign}${(value * 100).toFixed(1)}%`;
}
// // Example usage
// console.log(formatPercentage(40.4)); // Output: "+40.40%"
// console.log(formatPercentage(-15.678)); // Output: "-15.68%"
// console.log(formatPercentage(0)); // Output: "0.00%"

function formatPercentage_0(value: number): string {
	// Add a + sign for positive values, keep the sign for negative values
	const sign = value > 0 ? '+' : '';
	// Format the number with two decimal places and append %
	// return `${sign}${(value * 100).toFixed(2)}%`;
	return `${sign}${(value * 100).toFixed(0)}%`;
}
// // Example usage
// console.log(formatPercentage(40.4)); // Output: "+40.40%"
// console.log(formatPercentage(-15.678)); // Output: "-15.68%"
// console.log(formatPercentage(0)); // Output: "0.00%"

export const useCasesSimpleBarChartCustomComponentsCompositionSchema = z.object(
	{
		themeEnum: zThemeEnum,
	}
);

export const UseCasesSimpleBarChartCustomComponentsComposition: React.FC<
	z.infer<typeof useCasesSimpleBarChartCustomComponentsCompositionSchema>
> = ({themeEnum}) => {
	const theme = useThemeFromEnum(themeEnum);
	const {width, height, durationInFrames} = useVideoConfig();

	const durationInFrames_1 = Math.floor(durationInFrames / 3);
	const durationInFrames_2 = Math.floor(durationInFrames / 3);
	const durationInFrames_3 =
		durationInFrames - durationInFrames_1 - durationInFrames_2;

	return (
		<div style={{position: 'relative'}}>
			<PageContext
				margin={80}
				nrBaselines={50}
				width={width}
				height={height}
				theme={theme}
			>
				<Page>
					{({baseline, contentWidth}) => {
						return (
							<>
								<Sequence durationInFrames={durationInFrames_1} layout="none">
									<TypographyStyle
										typographyStyle={theme.typography.textStyles.h1}
										baseline={baseline}
										marginBottom={7}
									>
										Bar Chart with Custom Label
									</TypographyStyle>
									<SimpleBarChart
										key="custom-label"
										showLayout
										hideAxis
										LabelComponent={ImageLabelComponent}
										height={700}
										width={contentWidth}
										theme={theme}
										dataItems={dataBerlin}
									/>
								</Sequence>
								<Sequence
									from={durationInFrames_1}
									durationInFrames={durationInFrames_2}
									layout="none"
								>
									<TypographyStyle
										typographyStyle={theme.typography.textStyles.h1}
										baseline={baseline}
										marginBottom={7}
									>
										Bar Chart with Custom Value Label
										{/* no x axis, no layout, all datasets same size and positive */}
									</TypographyStyle>
									<SimpleBarChart
										key="custom-value-label"
										showLayout
										hideLabel
										ValueLabelComponent={ImageValueLabelComponent}
										height={700}
										width={contentWidth}
										theme={theme}
										dataItems={dataChange}
										tickLabelFormatter={formatPercentage_0}
									/>
								</Sequence>
								<Sequence
									from={durationInFrames_1 + durationInFrames_2}
									durationInFrames={durationInFrames_3}
									layout="none"
								>
									<TypographyStyle
										typographyStyle={theme.typography.textStyles.h1}
										baseline={baseline}
										marginBottom={7}
									>
										Bar Chart with Custom Bar and NO Value Label
										{/* no x axis, no layout, all datasets same size and positive */}
									</TypographyStyle>
									<SimpleBarChart
										key="custom-bar"
										// showLayout
										hideValueLabel
										hideLabel
										HorizontalBarComponent={HorizontalBarCustomComponent}
										height={650}
										width={contentWidth}
										theme={theme}
										// dataItems={dataBerlin}
										dataItems={dataChange}
										tickLabelFormatter={formatPercentage_0}
									/>
								</Sequence>
							</>
						);
					}}
				</Page>
			</PageContext>
		</div>
	);
};

const positiveColor = colorPalettes.Emerald[500];
const negativeColor = colorPalettes.Rose[500];

const dataBerlin = [
	{
		id: 'Id-001',
		label: 'Sunny',
		value: 30,
	},
	{
		id: 'Id-002',
		label: 'Mostly Sunny',
		value: 20,
	},
	{
		id: 'Id-003',
		label: 'Cloudy',
		value: 10,
	},
	{
		id: 'Id-004',
		label: 'Rainy',
		value: 5,
	},
	{
		id: 'Id-005',
		label: 'Windy',
		value: 20,
	},
	{
		id: 'Id-006',
		label: 'Thunder',
		value: 15,
	},
].map((it) => ({
	...it,
	color: it.value >= 0 ? positiveColor : negativeColor,
}));

const dataChange = [
	{
		id: 'Id-001',
		label: 'Sunny',
		value: -0.1,
	},
	{
		id: 'Id-002',
		label: 'Mostly Sunny',
		value: 0.23,
	},
	{
		id: 'Id-003',
		label: 'Cloudy',
		value: 0.04,
	},
	{
		id: 'Id-004',
		label: 'Rainy',
		value: 0.022,
	},
	{
		id: 'Id-005',
		label: 'Windy',
		value: -0.32,
	},
	{
		id: 'Id-006',
		label: 'Thunder',
		value: 0.4,
	},
].map((it) => ({
	...it,
	color: it.value >= 0 ? positiveColor : negativeColor,
}));
