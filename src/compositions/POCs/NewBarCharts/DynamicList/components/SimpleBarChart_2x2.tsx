import React, {useCallback} from 'react';
import {Sequence, useVideoConfig} from 'remotion';

import {TypographyStyle} from '../../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {isNumber} from 'lodash';
import {
	getPerfectBaselineForHeight,
	getPerfectHeightForBaseline,
} from '../packages/BarChartAnimation/getPerfectBaselineForHeight';
import {HtmlArea, DisplayGridRails} from '../../../../../acetti-layout';
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
import {usePage} from '../../../../../acetti-components/PageContext';
import {TextAnimationSubtle} from '../../../01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';

export const SimpleBarChart_2x2: React.FC<{
	dataUpperLeft: TBarChartItem[];
	dataUpperRight: TBarChartItem[];
	dataLowerLeft: TBarChartItem[];
	dataLowerRight: TBarChartItem[];
	dataUpperLeftDelayInSeconds?: number;
	dataUpperRightDelayInSeconds?: number;
	dataLowerLeftDelayInSeconds?: number;
	dataLowerRightDelayInSeconds?: number;
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
	dataUpperLeftDelayInSeconds = 0,
	dataUpperRightDelayInSeconds = 0,
	dataLowerLeftDelayInSeconds = 0,
	dataLowerRightDelayInSeconds = 0,
}) => {
	const LabelComponent = DefaultLabelComponent;
	const ValueLabelComponent = DefaultValueLabelComponent;

	const {fps} = useVideoConfig();
	const {baseline: pageBaseline} = usePage();

	const titleTypographyStyle = theme.typography.textStyles.h2;
	const titleMarginBottomInBaselines = 2;

	const titleCapHeight =
		titleTypographyStyle.capHeightInBaselines * pageBaseline;
	const titleMarginBottom = titleMarginBottomInBaselines * pageBaseline;

	const titleHeightInPixels = titleCapHeight + titleMarginBottom;

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

	const rowSpacePixels = 60;
	// const titleHeightPixels = 50; // TODO determine according to used typographystyle
	// const freeHeight = height - rowSpacePixels;

	const matrixLayout = useMatrixLayout({
		width,
		height,
		nrColumns: 2,
		nrRows: 5,
		rowSpacePixels: 0,
		columnSpacePixels: 150,
		rowPaddingPixels: 0,
		columnPaddingPixels: 0,
		rowSizes: [
			{type: 'pixel', value: titleHeightInPixels},
			{type: 'fr', value: 1},
			{type: 'pixel', value: rowSpacePixels},
			{type: 'pixel', value: titleHeightInPixels},
			{type: 'fr', value: relative_row_2_height},
		],
	});
	const areaUpperLeft = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 1,
		column: 0,
	});
	const areaUpperRight = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 1,
		column: 1,
	});
	const areaLowerLeft = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 4,
		column: 0,
	});
	const areaLowerRight = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 4,
		column: 1,
	});

	const areaUpperLeftTitle = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 0,
		column: 0,
	});
	const areaUpperRightTitle = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 0,
		column: 1,
	});
	const areaLowerLeftTitle = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 3,
		column: 0,
	});
	const areaLowerRightTitle = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 3,
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

	// TODO f(plotAreaWidth, baseline)
	const nrTicks = 4;

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
					{/* <DisplayGridRails {...matrixLayout} /> */}

					{/* bar chart 1 */}
					<Sequence
						from={Math.floor(fps * dataUpperLeftDelayInSeconds)}
						layout="none"
					>
						<HtmlArea area={areaUpperLeftTitle}>
							<TypographyStyle
								typographyStyle={titleTypographyStyle}
								baseline={pageBaseline}
								marginBottom={titleMarginBottomInBaselines}
							>
								<TextAnimationSubtle>Berlin</TextAnimationSubtle>
							</TypographyStyle>
						</HtmlArea>

						<Sequence from={Math.floor(fps * 0.5)} layout="none">
							<HtmlArea area={areaUpperLeft}>
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
									nrTicks={nrTicks}
								/>
							</HtmlArea>
						</Sequence>
					</Sequence>

					{/* bar chart 2 */}
					<Sequence
						from={Math.floor(fps * dataUpperRightDelayInSeconds)}
						layout="none"
					>
						<HtmlArea area={areaUpperRightTitle}>
							<TypographyStyle
								typographyStyle={titleTypographyStyle}
								baseline={pageBaseline}
								marginBottom={titleMarginBottomInBaselines}
							>
								<TextAnimationSubtle>Berlin</TextAnimationSubtle>
							</TypographyStyle>
						</HtmlArea>

						<Sequence from={Math.floor(fps * 0.5)} layout="none">
							<HtmlArea area={areaUpperRight}>
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
									nrTicks={nrTicks}
								/>
							</HtmlArea>
						</Sequence>
					</Sequence>

					{/* bar chart 3 */}
					<Sequence
						from={Math.floor(fps * dataLowerLeftDelayInSeconds)}
						layout="none"
					>
						<HtmlArea area={areaLowerLeftTitle}>
							<TypographyStyle
								typographyStyle={titleTypographyStyle}
								baseline={pageBaseline}
								marginBottom={titleMarginBottomInBaselines}
							>
								<TextAnimationSubtle>Berlin</TextAnimationSubtle>
							</TypographyStyle>
						</HtmlArea>

						<Sequence from={Math.floor(fps * 0.5)} layout="none">
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
									nrTicks={nrTicks}
								/>
							</HtmlArea>
						</Sequence>
					</Sequence>

					{/* bar chart 4 */}
					<Sequence
						from={Math.floor(fps * dataLowerRightDelayInSeconds)}
						layout="none"
					>
						<HtmlArea area={areaLowerRightTitle}>
							<TypographyStyle
								typographyStyle={titleTypographyStyle}
								baseline={pageBaseline}
								marginBottom={titleMarginBottomInBaselines}
							>
								<TextAnimationSubtle>Berlin</TextAnimationSubtle>
							</TypographyStyle>
						</HtmlArea>

						<Sequence from={Math.floor(fps * 0.5)} layout="none">
							<HtmlArea area={areaLowerRight}>
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
									nrTicks={nrTicks}
								/>
							</HtmlArea>
						</Sequence>
					</Sequence>
				</div>
			) : null}
		</>
	);
};
