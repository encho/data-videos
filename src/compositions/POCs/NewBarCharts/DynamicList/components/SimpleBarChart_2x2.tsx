import React from 'react';

import {
	getPerfectBaselineForHeight,
	getPerfectHeightForBaseline,
} from '../packages/BarChartAnimation/getPerfectBaselineForHeight';
import {HtmlArea} from '../../../../../acetti-layout';
import {SimpleBarChart} from './SimpleBarChart';
import {
	useMatrixLayout,
	getMatrixLayoutCellArea,
} from '../../../../../acetti-layout/hooks/useMatrixLayout';
import {TBarChartItem} from '../packages/BarChartAnimation/useBarChartTransition/useBarChartTransition';
import {ThemeType} from '../../../../../acetti-themes/themeTypes';

export const SimpleBarChart_2x2: React.FC<{
	dataUpperLeft: TBarChartItem[];
	dataUpperRight: TBarChartItem[];
	dataLowerLeft: TBarChartItem[];
	dataLowerRight: TBarChartItem[];
	theme: ThemeType;
	width: number;
	height: number;
}> = ({
	theme,
	width,
	height,
	dataUpperLeft,
	dataUpperRight,
	dataLowerLeft,
	dataLowerRight,
}) => {
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

	const commonDomain = [
		commonMin > 0 ? 0 : commonMin,
		commonMax < 0 ? 0 : commonMax,
	] as [number, number];

	// this baseline is just for initial calculations, it will be calculated automatically from now on
	const baseline = 10;

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

	const matrixLayout = useMatrixLayout({
		width,
		height,
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
		</>
	);
};
