import {z} from 'zod';
import React from 'react';
import {useVideoConfig, Sequence} from 'remotion';

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
import {Html} from '@react-three/drei';

export const useCasesSimpleBarChartMultiplesCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const UseCasesSimpleBarChartMultiplesComposition: React.FC<
	z.infer<typeof useCasesSimpleBarChartMultiplesCompositionSchema>
> = ({themeEnum}) => {
	const theme = useThemeFromEnum(themeEnum);
	const {width, height, durationInFrames} = useVideoConfig();

	return (
		<div style={{position: 'relative'}}>
			<PageContext
				margin={50}
				nrBaselines={60}
				width={width}
				height={height}
				theme={theme}
			>
				<Page>
					{({baseline, contentWidth}) => {
						// eslint-disable-next-line
						const matrixLayout = useMatrixLayout({
							width: contentWidth,
							height: height - 450,
							nrColumns: 2,
							nrRows: 2,
							rowSpacePixels: 100,
							columnSpacePixels: 150,
							rowPaddingPixels: 0,
							columnPaddingPixels: 0,
						});
						const area_1 = getMatrixLayoutCellArea({
							layout: matrixLayout,
							row: 0,
							column: 0,
						});
						const area_2 = getMatrixLayoutCellArea({
							layout: matrixLayout,
							row: 0,
							column: 1,
						});
						const area_3 = getMatrixLayoutCellArea({
							layout: matrixLayout,
							row: 1,
							column: 0,
						});
						const area_4 = getMatrixLayoutCellArea({
							layout: matrixLayout,
							row: 1,
							column: 1,
						});

						// const durationInFrames_onlyPositives = Math.floor(
						// 	durationInFrames / 3
						// );
						// const durationInFrames_onlyNegatives = Math.floor(
						// 	durationInFrames / 3
						// );
						// const durationInFrames_positivesAndNegatives =
						// 	durationInFrames -
						// 	durationInFrames_onlyNegatives -
						// 	durationInFrames_onlyPositives;

						return (
							<>
								<TypographyStyle
									typographyStyle={theme.typography.textStyles.h1}
									baseline={baseline}
									marginBottom={5}
								>
									Use Case:
									<br /> Simple Bar Chart Multiples
								</TypographyStyle>
								<div style={{position: 'relative'}}>
									{/* bar chart 1 */}
									<HtmlArea
										area={area_1}
										// fill="rgba(255,0,255,0.2)"
									>
										<SimpleBarChart
											// showLayout
											height={area_1.height}
											width={area_1.width}
											theme={theme}
											dataItems={fewItemsWithJustPositives}
										/>
									</HtmlArea>

									{/* bar chart 2 */}
									<HtmlArea
										area={area_2}
										// fill="rgba(255,0,255,0.2)"
									>
										<SimpleBarChart
											// showLayout
											height={area_2.height}
											width={area_2.width}
											theme={theme}
											dataItems={fewItemsWithJustNegatives}
										/>
									</HtmlArea>

									{/* bar chart 3 */}
									<HtmlArea
										area={area_3}
										// fill="rgba(255,0,255,0.2)"
									>
										<SimpleBarChart
											// showLayout
											height={area_3.height}
											width={area_3.width}
											theme={theme}
											dataItems={manyItemsWithNegatives}
										/>
									</HtmlArea>

									{/* bar chart 4 */}
									<HtmlArea
										area={area_4}
										// fill="rgba(255,0,255,0.2)"
									>
										<SimpleBarChart
											// showLayout
											height={area_3.height}
											width={area_3.width}
											theme={theme}
											dataItems={manyItemsWithNegatives}
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
