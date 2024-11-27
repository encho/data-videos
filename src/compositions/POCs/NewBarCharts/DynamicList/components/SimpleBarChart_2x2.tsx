import React, {useCallback} from 'react';

import {isNumber} from 'lodash';
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
import {
	DefaultValueLabelComponent,
	MeasureValueLabels,
} from '../packages/BarChartAnimation/BarsTransition/ValueLabelComponent';
import {
	DefaultLabelComponent,
	MeasureLabels,
} from '../packages/BarChartAnimation/BarsTransition/LabelComponent';
import {useElementDimensions} from '../../../03-Page/SimplePage/useElementDimensions';

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
	const LabelComponent = DefaultLabelComponent;
	const ValueLabelComponent = DefaultValueLabelComponent;

	// TODO
	// const {refs: {labels, valueLabels, bars}, dimensions: {labels, valueLabels, bars}, MeasureLabelCOmponent,MeaseureValueLabelCOmponent} =
	// useBarChartElementDimensions({baseline, theme})...
	const {ref: labelsRef, dimensions: labelsDimensions} =
		useElementDimensions(true);
	const {ref: valueLabelsRef, dimensions: valueLabelsDimensions} =
		useElementDimensions(true);
	const {
		ref: negativeValueLabelsRef,
		dimensions: negativeValueLabelsDimensions,
	} = useElementDimensions(true);

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

	const MeasureLabelComponent = useCallback(
		// eslint-disable-next-line
		({id, label}: {label: string; id: string}) => {
			return (
				<LabelComponent
					id={id}
					label={label}
					baseline={baseline}
					theme={theme}
					animateEnter={false}
					animateExit={false}
				/>
			);
		},
		[baseline, theme, LabelComponent]
	);

	// TODO get the corresponding component and it's parametrization from theme
	const MeasureValueLabelComponent = useCallback(
		// eslint-disable-next-line
		({id, value}: {id: string; value: number}) => {
			return (
				<ValueLabelComponent
					// id={id}
					baseline={baseline}
					theme={theme}
					animateEnter={false}
					animateExit={false}
					value={value}
				/>
			);
		},
		[baseline, theme, ValueLabelComponent]
	);

	const labelWidthProp = undefined;
	const valueLabelWidthProp = undefined;
	const negativeValueLabelWidthProp = undefined;

	const labelWidth = labelWidthProp || labelsDimensions?.width;
	const valueLabelWidth = valueLabelWidthProp || valueLabelsDimensions?.width;
	const negativeValueLabelWidth =
		negativeValueLabelWidthProp || negativeValueLabelsDimensions?.width;

	const allDataItems = [
		...dataUpperLeft,
		...dataUpperRight,
		...dataLowerLeft,
		...dataLowerRight,
	];

	return (
		<>
			{/* measure labels */}
			<MeasureLabels
				key="labelMeasurement"
				ref={labelsRef}
				data={allDataItems}
				theme={theme}
				baseline={baseline}
				Component={MeasureLabelComponent}
			/>

			{/* measure positive value labels */}
			<MeasureValueLabels
				key="valueLabelMeasurement"
				ref={valueLabelsRef}
				data={allDataItems.filter((it) => it.value >= 0)}
				theme={theme}
				baseline={baseline}
				Component={MeasureValueLabelComponent}
			/>
			{/* measure negative value labels */}
			<MeasureValueLabels
				key="negativeValueLabelMeasurement"
				ref={negativeValueLabelsRef}
				data={allDataItems.filter((it) => it.value < 0)}
				theme={theme}
				baseline={baseline}
				Component={MeasureValueLabelComponent}
			/>

			{isNumber(labelWidth) &&
			isNumber(valueLabelWidth) &&
			isNumber(negativeValueLabelWidth) ? (
				<div style={{position: 'relative'}}>
					{/* bar chart 1 */}
					<HtmlArea
						area={areaUpperLeft}
						// fill="rgba(255,0,255,0.2)"
					>
						<SimpleBarChart
							forceNegativeValueLabelWidth
							// showLayout
							height={areaUpperLeft.height}
							baseline={smallestCommonBaseline}
							width={areaUpperLeft.width}
							theme={theme}
							dataItems={dataUpperLeft}
							domain={commonDomain}
							labelWidth={labelWidth}
							valueLabelWidth={valueLabelWidth}
							negativeValueLabelWidth={negativeValueLabelWidth}
						/>
					</HtmlArea>

					{/* bar chart 2 */}
					<HtmlArea
						area={areaUpperRight}
						// fill="rgba(255,0,255,0.2)"
					>
						<SimpleBarChart
							forceNegativeValueLabelWidth
							// showLayout
							height={areaUpperRight.height}
							baseline={smallestCommonBaseline}
							width={areaUpperRight.width}
							theme={theme}
							dataItems={dataUpperRight}
							domain={commonDomain}
							labelWidth={labelWidth}
							valueLabelWidth={valueLabelWidth}
							negativeValueLabelWidth={negativeValueLabelWidth}
						/>
					</HtmlArea>

					{/* bar chart 3 */}
					<HtmlArea
						area={areaLowerLeft}
						// fill="rgba(255,0,255,0.2)"
					>
						<SimpleBarChart
							forceNegativeValueLabelWidth
							// showLayout
							height={areaLowerLeft.height}
							baseline={smallestCommonBaseline}
							width={areaLowerLeft.width}
							theme={theme}
							dataItems={dataLowerLeft}
							domain={commonDomain}
							labelWidth={labelWidth}
							valueLabelWidth={valueLabelWidth}
							negativeValueLabelWidth={negativeValueLabelWidth}
						/>
					</HtmlArea>

					{/* bar chart 4 */}
					<HtmlArea
						area={areaLowerRight}
						// fill="rgba(255,0,255,0.2)"
					>
						<SimpleBarChart
							forceNegativeValueLabelWidth
							// showLayout
							height={areaLowerLeft.height}
							baseline={smallestCommonBaseline}
							width={areaLowerLeft.width}
							theme={theme}
							dataItems={dataLowerRight}
							domain={commonDomain}
							labelWidth={labelWidth}
							valueLabelWidth={valueLabelWidth}
							negativeValueLabelWidth={negativeValueLabelWidth}
						/>
					</HtmlArea>
				</div>
			) : null}
		</>
	);
};
