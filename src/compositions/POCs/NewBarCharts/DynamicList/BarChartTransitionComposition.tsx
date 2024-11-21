import {z} from 'zod';
import React, {useCallback} from 'react';
import {Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {isNumber} from 'lodash';

import {BarChartTransitionUpdate} from './BarChartTransition';
import {getBarChartItemHeight} from './useBarChartTransition';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {Page} from '../../../../acetti-components/Page';
import {PageContext, usePage} from '../../../../acetti-components/PageContext';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {useListTransition} from './useListTransition/useListTransition';
import {HtmlArea} from '../../../../acetti-layout';
import {
	getMatrixLayoutCellArea,
	useMatrixLayout,
} from '../../../../acetti-layout/hooks/useMatrixLayout';
import {useBarChartTransition} from './useBarChartTransition';
import {
	DefaultLabelComponent,
	TBarChartLabelComponent,
	DefaultValueLabelComponent,
	TBarChartValueLabelComponent,
	MeasureLabels,
	MeasureValueLabels,
} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {useElementDimensions} from '../../03-Page/SimplePage/useElementDimensions';

export const barChartTransitionCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const BarChartTransitionComposition: React.FC<
	z.infer<typeof barChartTransitionCompositionSchema>
> = ({themeEnum}) => {
	const theme = useThemeFromEnum(themeEnum);
	const {width, height} = useVideoConfig();

	const barchartBaseline = 24;

	const LabelComponent = DefaultLabelComponent;
	const ValueLabelComponent = DefaultValueLabelComponent;

	const {ref: labelsRef, dimensions: labelsDimensions} =
		useElementDimensions(true);
	const {ref: valueLabelsRef, dimensions: valueLabelsDimensions} =
		useElementDimensions(true);
	const {
		ref: negativeValueLabelsRef,
		dimensions: negativeValueLabelsDimensions,
	} = useElementDimensions(true);

	const MeasureLabelComponent = useCallback(
		// eslint-disable-next-line
		({id, children}: {children: string; id: string}) => {
			return (
				<LabelComponent
					id={id}
					baseline={barchartBaseline}
					theme={theme}
					animateEnter={false}
					animateExit={false}
				>
					{children}
				</LabelComponent>
			);
		},
		[barchartBaseline, theme, LabelComponent]
	);

	// TODO get the corresponding component and it's parametrization from theme
	const MeasureValueLabelComponent = useCallback(
		// eslint-disable-next-line
		({id, children, value}: {children: string; id: string; value: number}) => {
			return (
				<ValueLabelComponent
					// id={id}
					baseline={barchartBaseline}
					theme={theme}
					animateEnter={false}
					animateExit={false}
					value={value}
				>
					{children}
				</ValueLabelComponent>
			);
		},
		[barchartBaseline, theme, ValueLabelComponent]
	);

	const labelWidthProp = undefined;
	const valueLabelWidthProp = undefined;
	const negativeValueLabelWidthProp = undefined;

	const labelWidth = labelWidthProp || labelsDimensions?.width;
	const valueLabelWidth = valueLabelWidthProp || valueLabelsDimensions?.width;
	const negativeValueLabelWidth =
		negativeValueLabelWidthProp || negativeValueLabelsDimensions?.width;

	return (
		<>
			{/* measure labels */}
			<MeasureLabels
				key="labelMeasurement"
				ref={labelsRef}
				data={[...itemsFrom, ...itemsTo]}
				theme={theme}
				baseline={barchartBaseline}
				Component={MeasureLabelComponent}
			/>

			{/* measure positive value labels */}
			<MeasureValueLabels
				key="valueLabelMeasurement"
				ref={valueLabelsRef}
				data={[...itemsFrom, ...itemsTo].filter((it) => it.value >= 0)}
				theme={theme}
				baseline={barchartBaseline}
				Component={MeasureValueLabelComponent}
			/>
			{/* measure negative value labels */}
			<MeasureValueLabels
				key="negativeValueLabelMeasurement"
				ref={negativeValueLabelsRef}
				data={[...itemsFrom, ...itemsTo].filter((it) => it.value < 0)}
				theme={theme}
				baseline={barchartBaseline}
				Component={MeasureValueLabelComponent}
			/>

			{isNumber(labelWidth) &&
			isNumber(valueLabelWidth) &&
			isNumber(negativeValueLabelWidth) ? (
				<PageContext
					margin={50}
					nrBaselines={40}
					width={width}
					height={height}
					theme={theme}
				>
					<BarChartTransitionPage
						itemsFrom={itemsFrom}
						itemsTo={itemsTo}
						visibleIndicesFrom={[0, 3]}
						visibleIndicesTo={[0, 3]}
						labelWidth={labelWidth}
						valueLabelWidth={valueLabelWidth}
						negativeValueLabelWidth={negativeValueLabelWidth}
						LabelComponent={LabelComponent}
						ValueLabelComponent={ValueLabelComponent}
						baseline={barchartBaseline}
					/>
				</PageContext>
			) : null}
		</>
	);
};

type TBarChartItem = {
	id: string;
	label: string;
	valueLabel: string;
	value: number;
};

type TBarChartItems = TBarChartItem[];

const BarChartTransitionPage: React.FC<{
	itemsFrom: TBarChartItems;
	itemsTo: TBarChartItems;
	visibleIndicesFrom: [number, number];
	visibleIndicesTo: [number, number];
	labelWidth: number;
	valueLabelWidth: number;
	negativeValueLabelWidth: number;
	LabelComponent: TBarChartLabelComponent;
	ValueLabelComponent: TBarChartValueLabelComponent;
	baseline: number;
}> = ({
	itemsFrom,
	itemsTo,
	visibleIndicesFrom,
	visibleIndicesTo,
	labelWidth,
	valueLabelWidth,
	negativeValueLabelWidth,
	LabelComponent,
	ValueLabelComponent,
	baseline,
}) => {
	const {theme, contentWidth, contentHeight} = usePage();
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const matrixLayout = useMatrixLayout({
		width: contentWidth,
		height: contentHeight - 280,
		nrColumns: 1,
		nrRows: 1,
		rowSpacePixels: 0,
		columnSpacePixels: 50,
		rowPaddingPixels: 0,
		columnPaddingPixels: 0,
	});
	const area_1 = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 0,
		column: 0,
	});

	const barChartItemHeight = getBarChartItemHeight({baseline});

	const listTransitionContext = useListTransition({
		itemMarginTop: baseline * 0,
		itemMarginBottom: baseline * 0,
		itemHeight: barChartItemHeight,
		frame,
		durationInFrames,
		itemsFrom,
		itemsTo,
		visibleIndicesFrom,
		visibleIndicesTo,
		width: area_1.width,
		height: area_1.height,
		justifyContent: 'start',
		easing: Easing.ease,
	});

	const barChartTransitionContext = useBarChartTransition({
		listTransitionContext,
		baseline,
		labelWidth,
		valueLabelWidth,
		negativeValueLabelWidth,
	});

	return (
		<Page>
			<TypographyStyle
				typographyStyle={theme.typography.textStyles.h1}
				baseline={baseline}
				marginBottom={2}
			>
				Bar Chart Transition
			</TypographyStyle>

			<div style={{position: 'relative'}}>
				<HtmlArea area={area_1}>
					{listTransitionContext.transitionType === 'update' ? (
						<BarChartTransitionUpdate
							listTransitionContext={listTransitionContext}
							barChartTransitionContext={barChartTransitionContext}
							LabelComponent={LabelComponent}
							ValueLabelComponent={ValueLabelComponent}
						/>
					) : null}
					{listTransitionContext.transitionType === 'enter' ? (
						<div style={{backgroundColor: 'green', fontSize: 40, padding: 40}}>
							Implement Enter!
						</div>
					) : null}
					{listTransitionContext.transitionType === 'exit' ? (
						<div style={{backgroundColor: 'red', fontSize: 40, padding: 40}}>
							Implement Exit!
						</div>
					) : null}
				</HtmlArea>
			</div>
		</Page>
	);
};

const itemsFrom = [
	{id: 'Id-001', label: 'Item 001', valueLabel: '$10.00', value: 10},
	{id: 'Id-002', label: 'Item 002', valueLabel: '$20.50', value: 20.5},
	{id: 'Id-003', label: 'Item 003', valueLabel: '$30.75', value: 30.75},
	{id: 'Id-004', label: 'Item 004', valueLabel: '$40.25', value: 40.25},
	{id: 'Id-011', label: 'Item 011', valueLabel: '$55.10', value: 55.1},
	{id: 'Id-005', label: 'Item 005', valueLabel: '$25.30', value: 25.3},
	{id: 'Id-006', label: 'Item 006', valueLabel: '$60.60', value: 60.6},
	{id: 'Id-007', label: 'Item 007', valueLabel: '$35.80', value: 35.8},
	{id: 'Id-010', label: 'Item 010', valueLabel: '$45.90', value: 45.9},
];

const itemsTo = [
	{id: 'Id-009', label: 'Item 009', valueLabel: '$70.00', value: 70},
	{id: 'Id-003', label: 'Item 003', valueLabel: '$30.75', value: 30.75},
	{id: 'Id-007', label: 'Item 007', valueLabel: '$20.80', value: 20.8},
	{id: 'Id-002', label: 'Item 002', valueLabel: '$20.50', value: 20.5},
	{id: 'Id-005', label: 'Item 005', valueLabel: '$33.30', value: 33.3},
	{id: 'Id-001', label: 'Item 001', valueLabel: '$12.00', value: 12},
];
