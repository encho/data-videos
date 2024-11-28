import {z} from 'zod';
import React from 'react';
import {useVideoConfig, Sequence} from 'remotion';

import {colorPalettes} from '../../../../acetti-themes/tailwindPalettes';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {Page} from '../../../../acetti-components/Page';
import {PageContext} from '../../../../acetti-components/PageContext';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {SimpleBarChart_Composed} from './components/SimpleBarChart_Composed';

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

export const useCasesSimpleBarChartComposedCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const UseCasesSimpleBarChartComposedComposition: React.FC<
	z.infer<typeof useCasesSimpleBarChartComposedCompositionSchema>
> = ({themeEnum}) => {
	const theme = useThemeFromEnum(themeEnum);
	const {width, height, durationInFrames} = useVideoConfig();

	const durationInFrames_1 = Math.floor(durationInFrames / 2);
	const durationInFrames_2 = durationInFrames - durationInFrames_1;

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
										Simple Bar Chart Composed (1)
										{/* no x axis, no layout, all datasets same size and positive */}
									</TypographyStyle>
									<SimpleBarChart_Composed
										// showLayout
										hideAxis
										dataLeft={dataBerlin}
										dataRight={dataChange}
										titleLeft="Performance 2024"
										titleRight="vs. Previous Year"
										dataUpperLeftDelayInSeconds={0}
										dataUpperRightDelayInSeconds={3}
										theme={theme}
										width={contentWidth}
										height={680}
										valueLabelFormatterRight={formatPercentage}
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
										Simple Bar Chart Composed (1)
										{/* no x axis, no layout, all datasets same size and positive */}
									</TypographyStyle>
									<SimpleBarChart_Composed
										// showLayout
										// hideAxis
										dataLeft={dataBerlin}
										dataRight={dataChange}
										titleLeft="Performance 2024"
										titleRight="vs. Previous Year"
										dataUpperLeftDelayInSeconds={0}
										dataUpperRightDelayInSeconds={3}
										theme={theme}
										width={contentWidth}
										height={680}
										valueLabelFormatterRight={formatPercentage}
										tickLabelFormatterRight={formatPercentage_0}
										nrTicksRight={2}
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
