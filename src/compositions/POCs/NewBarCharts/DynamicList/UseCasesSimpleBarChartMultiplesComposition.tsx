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
import {SimpleBarChart_2x2} from './components/SimpleBarChart_2x2';

export const useCasesSimpleBarChartMultiplesCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const UseCasesSimpleBarChartMultiplesComposition: React.FC<
	z.infer<typeof useCasesSimpleBarChartMultiplesCompositionSchema>
> = ({themeEnum}) => {
	const theme = useThemeFromEnum(themeEnum);
	const {width, height, durationInFrames} = useVideoConfig();

	const durationInFrames_1 = Math.floor(durationInFrames / 2);
	const durationInFrames_2 = durationInFrames - durationInFrames_1;

	const dataUpperLeft = fewItemsWithJustPositives;
	const dataUpperRight = fewItemsWithJustNegatives;
	const dataLowerLeft = manyItemsWithNegatives;
	const dataLowerRight = veryFewItemsWithJustNegatives;

	return (
		<div style={{position: 'relative'}}>
			<PageContext
				margin={80}
				nrBaselines={80}
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
										Simple Bar Chart Multiples (1)
										{/* no x axis, no layout, all datasets same size and positive */}
									</TypographyStyle>
									<SimpleBarChart_2x2
										// showLayout
										hideAxis
										dataUpperLeft={dataBerlin}
										dataUpperRight={dataLondon}
										dataLowerLeft={dataParis}
										dataLowerRight={dataNewYork}
										dataUpperLeftDelayInSeconds={0}
										dataUpperRightDelayInSeconds={3}
										dataLowerLeftDelayInSeconds={6}
										dataLowerRightDelayInSeconds={9}
										theme={theme}
										width={contentWidth}
										height={760}
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
										Simple Bar Chart Multiples
									</TypographyStyle>
									<SimpleBarChart_2x2
										showLayout
										dataUpperLeft={dataUpperLeft}
										dataUpperRight={dataUpperRight}
										dataLowerLeft={dataLowerLeft}
										dataLowerRight={dataLowerRight}
										dataUpperLeftDelayInSeconds={0}
										dataUpperRightDelayInSeconds={3}
										dataLowerLeftDelayInSeconds={6}
										dataLowerRightDelayInSeconds={9}
										theme={theme}
										width={contentWidth}
										height={760}
										// areRowsEqualHeight={false}
										// fitItemsHeight={false}
										// hideAxis
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

const positiveColor = colorPalettes.Green[500];
const negativeColor = colorPalettes.Red[500];

const manyItemsWithNegatives = [
	{
		id: 'Id-001',
		label: 'Item 001',
		value: 10,
	},
	{
		id: 'Id-002',
		label: 'Item 002',
		value: 20.5,
	},
	{
		id: 'Id-003',
		label: 'Item 003',
		value: 30.75,
	},
	{
		id: 'Id-004',
		label: 'Item 004',
		value: -40.25,
	},
	{
		id: 'Id-011',
		label: 'Item 011',
		value: -55.1,
	},
	{
		id: 'Id-005',
		label: 'Item 005',
		value: -25.3,
	},
	{
		id: 'Id-006',
		label: 'Item 006',
		value: 60.6,
	},
	{
		id: 'Id-007',
		label: 'Item 007',
		value: 35.8,
	},
	{
		id: 'Id-010',
		label: 'Item 010',
		value: 45.9,
	},
].map((it) => ({
	...it,
	color: it.value >= 0 ? positiveColor : negativeColor,
}));

const fewItemsWithJustPositives = [
	{
		id: 'Id-009',
		label: 'Item 009',
		value: 70,
	},
	{
		id: 'Id-003',
		label: 'Item 003',
		value: 30.75,
	},
	{
		id: 'Id-007',
		label: 'Item 007',
		value: 20.8,
	},
	{
		id: 'Id-002',
		label: 'Item 002',
		value: 20.5,
	},
	{
		id: 'Id-005',
		label: 'Item 005',
		value: 33.3,
	},
	{
		id: 'Id-001',
		label: 'Item 001',
		value: 12,
	},
].map((it) => ({
	...it,
	color: it.value >= 0 ? positiveColor : negativeColor,
}));

const fewItemsWithJustNegatives = [
	{
		id: 'Id-009',
		label: 'Item 009',
		value: -70,
	},
	{
		id: 'Id-003',
		label: 'Item 003',
		value: -30.75,
	},
	{
		id: 'Id-007',
		label: 'Item 007',
		value: -20.8,
	},
	{
		id: 'Id-002',
		label: 'Item 002',
		value: -20.5,
	},
	{
		id: 'Id-005',
		label: 'Item 005',
		value: -33.3,
	},
	{
		id: 'Id-001',
		label: 'Item 001',
		value: -12,
	},
].map((it) => ({
	...it,
	color: it.value >= 0 ? positiveColor : negativeColor,
}));

const veryFewItemsWithJustNegatives = [
	{
		id: 'Id-002',
		label: 'Item 002',
		value: -20.5,
	},
	{
		id: 'Id-005',
		label: 'Item 005',
		value: -33.3,
	},
	{
		id: 'Id-001',
		label: 'Item 001',
		value: -12,
	},
].map((it) => ({
	...it,
	color: it.value >= 0 ? positiveColor : negativeColor,
}));

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

const dataLondon = [
	{
		id: 'Id-001',
		label: 'Sunny',
		value: 10,
	},
	{
		id: 'Id-002',
		label: 'Mostly Sunny',
		value: 10,
	},
	{
		id: 'Id-003',
		label: 'Cloudy',
		value: 10,
	},
	{
		id: 'Id-004',
		label: 'Rainy',
		value: 50,
	},
	{
		id: 'Id-005',
		label: 'Windy',
		value: 10,
	},
	{
		id: 'Id-006',
		label: 'Thunder',
		value: 10,
	},
].map((it) => ({
	...it,
	color: it.value >= 0 ? positiveColor : negativeColor,
}));

const dataParis = [
	{
		id: 'Id-001',
		label: 'Sunny',
		value: 20,
	},
	{
		id: 'Id-002',
		label: 'Mostly Sunny',
		value: 20,
	},
	{
		id: 'Id-003',
		label: 'Cloudy',
		value: 20,
	},
	{
		id: 'Id-004',
		label: 'Rainy',
		value: 20,
	},
	{
		id: 'Id-005',
		label: 'Windy',
		value: 10,
	},
	{
		id: 'Id-006',
		label: 'Thunder',
		value: 10,
	},
].map((it) => ({
	...it,
	color: it.value >= 0 ? positiveColor : negativeColor,
}));

const dataNewYork = [
	{
		id: 'Id-001',
		label: 'Sunny',
		value: 30,
	},
	{
		id: 'Id-002',
		label: 'Mostly Sunny',
		value: 10,
	},
	{
		id: 'Id-003',
		label: 'Cloudy',
		value: 10,
	},
	{
		id: 'Id-004',
		label: 'Rainy',
		value: 20,
	},
	{
		id: 'Id-005',
		label: 'Windy',
		value: 10,
	},
	{
		id: 'Id-006',
		label: 'Thunder',
		value: 20,
	},
].map((it) => ({
	...it,
	color: it.value >= 0 ? positiveColor : negativeColor,
}));
