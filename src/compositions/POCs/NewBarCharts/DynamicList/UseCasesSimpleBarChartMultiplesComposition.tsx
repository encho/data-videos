import {z} from 'zod';
import React from 'react';
import {useVideoConfig} from 'remotion';

import {
	getPerfectBaselineForHeight,
	getPerfectHeightForBaseline,
} from './packages/BarChartAnimation/getPerfectBaselineForHeight';
import {HtmlArea} from '../../../../acetti-layout';
import {SimpleBarChart} from './SimpleBarChart';
import {colorPalettes} from '../../../../acetti-themes/tailwindPalettes';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {Page} from '../../../../acetti-components/Page';
import {PageContext} from '../../../../acetti-components/PageContext';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {
	useMatrixLayout,
	getMatrixLayoutCellArea,
} from '../../../../acetti-layout/hooks/useMatrixLayout';

export const useCasesSimpleBarChartMultiplesCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const UseCasesSimpleBarChartMultiplesComposition: React.FC<
	z.infer<typeof useCasesSimpleBarChartMultiplesCompositionSchema>
> = ({themeEnum}) => {
	const theme = useThemeFromEnum(themeEnum);
	const {width, height} = useVideoConfig();

	const dataUpperLeft = fewItemsWithJustPositives;
	const dataUpperRight = fewItemsWithJustNegatives;
	const dataLowerLeft = manyItemsWithNegatives;
	const dataLowerRight = veryFewItemsWithJustNegatives;

	const commonMin = Math.min(
		...[
			...dataUpperLeft,
			...dataUpperRight,
			...dataLowerLeft,
			...dataLowerRight,
		].map((it) => it.value)
	);
	const commonMax = Math.max(
		...[
			...dataUpperLeft,
			...dataUpperRight,
			...dataLowerLeft,
			...dataLowerRight,
		].map((it) => it.value)
	);

	const commonDomain = [commonMin, commonMax] as [number, number];

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
						const heightUpperLeft = getPerfectHeightForBaseline({
							theme,
							baseline,
							nrItems: dataUpperLeft.length,
						});
						const heightUpperRight = getPerfectHeightForBaseline({
							theme,
							baseline,
							nrItems: dataUpperRight.length,
						});
						const heightLowerLeft = getPerfectHeightForBaseline({
							theme,
							baseline,
							nrItems: dataLowerLeft.length,
						});
						const heightLowerRight = getPerfectHeightForBaseline({
							theme,
							baseline,
							nrItems: dataLowerRight.length,
						});

						const row_1_height = Math.max(heightUpperLeft, heightUpperRight);
						const row_2_height = Math.max(heightLowerLeft, heightLowerRight);

						const relative_row_2_height = row_2_height / row_1_height;

						// eslint-disable-next-line
						const matrixLayout = useMatrixLayout({
							width: contentWidth,
							height: height - 280,
							nrColumns: 2,
							nrRows: 2,
							rowSpacePixels: 100,
							columnSpacePixels: 150,
							rowPaddingPixels: 0,
							columnPaddingPixels: 0,
							rowSizes: [
								{type: 'fr', value: 1},
								{type: 'fr', value: relative_row_2_height},
							],
						});
						const areaUpperLeft = getMatrixLayoutCellArea({
							layout: matrixLayout,
							row: 0,
							column: 0,
						});
						const areaUpperRight = getMatrixLayoutCellArea({
							layout: matrixLayout,
							row: 0,
							column: 1,
						});
						const areaLowerLeft = getMatrixLayoutCellArea({
							layout: matrixLayout,
							row: 1,
							column: 0,
						});
						const areaLowerRight = getMatrixLayoutCellArea({
							layout: matrixLayout,
							row: 1,
							column: 1,
						});

						// TODO pass xAxis visible flag
						const baselineUpperLeft = getPerfectBaselineForHeight({
							height: areaUpperLeft.height,
							theme,
							nrItems: dataUpperLeft.length,
						});

						const baselineUpperRight = getPerfectBaselineForHeight({
							height: areaUpperRight.height,
							theme,
							nrItems: dataUpperRight.length,
						});

						const baselineLowerLeft = getPerfectBaselineForHeight({
							height: areaLowerLeft.height,
							theme,
							nrItems: dataLowerLeft.length,
						});

						const baselineLowerRight = getPerfectBaselineForHeight({
							height: areaLowerRight.height,
							theme,
							nrItems: dataLowerRight.length,
						});

						const smallestCommonBaseline = Math.min(
							baselineUpperLeft,
							baselineUpperRight,
							baselineLowerLeft,
							baselineLowerRight
						);

						return (
							<>
								<TypographyStyle
									typographyStyle={theme.typography.textStyles.h1}
									baseline={baseline}
									marginBottom={7}
								>
									Simple Bar Chart Multiples
								</TypographyStyle>
								<div style={{position: 'relative'}}>
									{/* bar chart 1 */}
									<HtmlArea
										area={areaUpperLeft}
										// fill="rgba(255,0,255,0.2)"
									>
										<SimpleBarChart
											// showLayout
											height={areaUpperLeft.height}
											baseline={smallestCommonBaseline}
											width={areaUpperLeft.width}
											theme={theme}
											dataItems={dataUpperLeft}
											domain={commonDomain}
										/>
									</HtmlArea>

									{/* bar chart 2 */}
									<HtmlArea
										area={areaUpperRight}
										// fill="rgba(255,0,255,0.2)"
									>
										<SimpleBarChart
											// showLayout
											height={areaUpperRight.height}
											baseline={smallestCommonBaseline}
											width={areaUpperRight.width}
											theme={theme}
											dataItems={dataUpperRight}
											domain={commonDomain}
										/>
									</HtmlArea>

									{/* bar chart 3 */}
									<HtmlArea
										area={areaLowerLeft}
										// fill="rgba(255,0,255,0.2)"
									>
										<SimpleBarChart
											// showLayout
											height={areaLowerLeft.height}
											baseline={smallestCommonBaseline}
											width={areaLowerLeft.width}
											theme={theme}
											dataItems={dataLowerLeft}
											domain={commonDomain}
										/>
									</HtmlArea>

									{/* bar chart 4 */}
									<HtmlArea
										area={areaLowerRight}
										// fill="rgba(255,0,255,0.2)"
									>
										<SimpleBarChart
											// showLayout
											height={areaLowerLeft.height}
											baseline={smallestCommonBaseline}
											width={areaLowerLeft.width}
											theme={theme}
											dataItems={dataLowerRight}
											domain={commonDomain}
										/>
									</HtmlArea>
								</div>
								{/* <Sequence
									durationInFrames={durationInFrames_onlyPositives}
									layout="none"
								>
									<SimpleBarChart
										// showLayout
										height={700}
										width={contentWidth}
										theme={theme}
										dataItems={fewItemsWithJustPositives}
									/>
								</Sequence> */}
								{/* <Sequence
									from={durationInFrames_onlyPositives}
									durationInFrames={durationInFrames_onlyNegatives}
									layout="none"
								>
									<SimpleBarChart
										// showLayout
										height={700}
										width={contentWidth}
										theme={theme}
										dataItems={fewItemsWithJustNegatives}
									/>
								</Sequence> */}
								{/* <Sequence
									from={
										durationInFrames_onlyPositives +
										durationInFrames_onlyNegatives
									}
									durationInFrames={durationInFrames_positivesAndNegatives}
									layout="none"
								>
									<SimpleBarChart
										// showLayout
										height={700}
										width={contentWidth}
										theme={theme}
										dataItems={manyItemsWithNegatives}
									/>
								</Sequence> */}
							</>
						);
					}}
				</Page>
			</PageContext>
		</div>
	);
};

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
	color: it.value >= 0 ? colorPalettes.Indigo[500] : colorPalettes.Orange[500],
}));

const fewItemsWithJustPositives = [
	{
		id: 'Id-009',
		label: 'Item 009',
		value: 70,
		color: '#FF5733',
	},
	{
		id: 'Id-003',
		label: 'Item 003',
		value: 30.75,
		color: '#3357FF',
	},
	{
		id: 'Id-007',
		label: 'Item 007',
		value: 20.8,
		color: '#C7FF33',
	},
	{
		id: 'Id-002',
		label: 'Item 002',
		value: 20.5,
		color: '#33FF57',
	},
	{
		id: 'Id-005',
		label: 'Item 005',
		value: 33.3,
		color: '#33FFF3',
	},
	{
		id: 'Id-001',
		label: 'Item 001',
		value: 12,
		color: '#FF5733',
	},
];

const fewItemsWithJustNegatives = [
	{
		id: 'Id-009',
		label: 'Item 009',
		value: -70,
		color: '#FF5733',
	},
	{
		id: 'Id-003',
		label: 'Item 003',
		value: -30.75,
		color: '#3357FF',
	},
	{
		id: 'Id-007',
		label: 'Item 007',
		value: -20.8,
		color: '#C7FF33',
	},
	{
		id: 'Id-002',
		label: 'Item 002',
		value: -20.5,
		color: '#33FF57',
	},
	{
		id: 'Id-005',
		label: 'Item 005',
		value: -33.3,
		color: '#33FFF3',
	},
	{
		id: 'Id-001',
		label: 'Item 001',
		value: -12,
		color: '#FF5733',
	},
];

const veryFewItemsWithJustNegatives = [
	// {
	// 	id: 'Id-009',
	// 	label: 'Item 009',
	// 	value: -70,
	// 	color: '#FF5733',
	// },
	// {
	// 	id: 'Id-003',
	// 	label: 'Item 003',
	// 	value: -30.75,
	// 	color: '#3357FF',
	// },
	// {
	// 	id: 'Id-007',
	// 	label: 'Item 007',
	// 	value: -20.8,
	// 	color: '#C7FF33',
	// },
	{
		id: 'Id-002',
		label: 'Item 002',
		value: -20.5,
		color: '#33FF57',
	},
	{
		id: 'Id-005',
		label: 'Item 005',
		value: -33.3,
		color: '#33FFF3',
	},
	{
		id: 'Id-001',
		label: 'Item 001',
		value: -12,
		color: '#FF5733',
	},
];
