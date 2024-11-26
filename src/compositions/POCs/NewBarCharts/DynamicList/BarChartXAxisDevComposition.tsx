import {z} from 'zod';
import React, {useCallback} from 'react';
import {useVideoConfig, Easing} from 'remotion';
import {isNumber} from 'lodash';

import {XAxisTransition} from './packages/BarChartAnimation/XAxisTransition/XAxisTransition';
import {useElementDimensions} from '../../03-Page/SimplePage/useElementDimensions';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {Page} from '../../../../acetti-components/Page';
import {PageContext} from '../../../../acetti-components/PageContext';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {HtmlArea, DisplayGridRails} from '../../../../acetti-layout';
import {
	getMatrixLayoutCellArea,
	useMatrixLayout,
} from '../../../../acetti-layout/hooks/useMatrixLayout';
import {
	useListAnimation,
	ListAnimationTransition,
} from './packages/ListAnimation/useListAnimation';
import {BarsTransition} from './packages/BarChartAnimation/BarsTransition/BarsTransition';
import {TBarChartItem} from './packages/BarChartAnimation/useBarChartTransition/useBarChartTransition';
import {useBarChartTransition} from './packages/BarChartAnimation/useBarChartTransition/useBarChartTransition';
import {
	getBarChartItemHeight,
	getAllBarChartItemsHeight,
} from './packages/BarChartAnimation/useBarChartTransition/getBarChartItemLayout';
import {
	DefaultValueLabelComponent,
	MeasureValueLabels,
} from './packages/BarChartAnimation/BarsTransition/ValueLabelComponent';
import {
	DefaultLabelComponent,
	MeasureLabels,
} from './packages/BarChartAnimation/BarsTransition/LabelComponent';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {
	getXAxisHeight,
	getXAxisMarginTop,
} from './packages/BarChartAnimation/XAxisTransition/getStyles_XAxis';

export const barChartXAxisDevCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const BarChartXAxisDevComposition: React.FC<
	z.infer<typeof barChartXAxisDevCompositionSchema>
> = ({themeEnum}) => {
	const theme = useThemeFromEnum(themeEnum);
	const {width, height} = useVideoConfig();

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
						return (
							<>
								<TypographyStyle
									typographyStyle={theme.typography.textStyles.h1}
									baseline={baseline}
									marginBottom={5}
								>
									Bar Chart X-Axis Dev
								</TypographyStyle>
								<HorizontalBarChart
									showLayout
									height={770}
									width={contentWidth}
									theme={theme}
								/>
							</>
						);
					}}
				</Page>
			</PageContext>
		</div>
	);
};

function getPerfectBaselineForHeight({
	height,
	nrItems,
	theme,
}: {
	height: number;
	nrItems: number;
	theme: ThemeType;
}) {
	const referenceBaseline = 10;
	const remainingSpaceForBars =
		height -
		getXAxisHeight({theme, baseline: referenceBaseline}) -
		getXAxisMarginTop({baseline: referenceBaseline});

	const ibcsBarsHeight = getAllBarChartItemsHeight({
		baseline: referenceBaseline,
		nrItems,
	});

	const baselineFactor = remainingSpaceForBars / ibcsBarsHeight;

	return referenceBaseline * baselineFactor;
}

export const HorizontalBarChart: React.FC<{
	baseline?: number;
	height: number;
	width: number;
	theme: ThemeType;
	showLayout?: boolean;
}> = ({baseline: baselineProp, height, width, theme, showLayout = false}) => {
	const {durationInFrames, fps} = useVideoConfig();

	const LabelComponent = DefaultLabelComponent;
	const ValueLabelComponent = DefaultValueLabelComponent;

	const MOST_ITEMS_AT_ONCE = 9;

	const baseline = baselineProp
		? baselineProp
		: getPerfectBaselineForHeight({theme, nrItems: MOST_ITEMS_AT_ONCE, height});

	const xAxisHeight = getXAxisHeight({theme, baseline});
	const xAxisMarginTop = getXAxisMarginTop({baseline});

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

	const matrixLayout = useMatrixLayout({
		width,
		height,
		nrColumns: 1,
		nrRows: 2,
		rowSpacePixels: xAxisMarginTop,
		columnSpacePixels: 0,
		rowPaddingPixels: 0,
		columnPaddingPixels: 0,
		columnSizes: [{type: 'fr', value: 1}],
		rowSizes: [
			{type: 'fr', value: 1},
			{type: 'pixel', value: xAxisHeight},
		],
	});
	const barsArea = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 0,
		column: 0,
	});
	const xAxisArea = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 1,
		column: 0,
	});

	const duration_0 = Math.floor(fps * 3);
	const duration_1 = Math.floor(durationInFrames / 5);
	const duration_2 = Math.floor(durationInFrames / 5);
	const duration_3 = Math.floor(durationInFrames / 5);
	const duration_4 =
		durationInFrames - duration_0 - duration_1 - duration_2 - duration_3;

	// const easing = Easing.bezier(0.16, 1, 0.3, 1); // easeOutExpo
	const easing = Easing.bounce;

	const transitions: ListAnimationTransition<TBarChartItem>[] = [
		{
			itemsTo: manyItemsWithNegatives,
			durationInFrames: duration_0,
		},
		{
			itemsTo: fewItemsWithJustPositives,
			durationInFrames: duration_1,
		},
		{
			itemsTo: manyItemsWithNegatives,
			durationInFrames: duration_2,
		},
		{
			itemsTo: fewItemsWithJustPositives,
			durationInFrames: duration_3,
		},
		{
			itemsTo: [],
			durationInFrames: duration_4,
		},
	];

	const ibcsItemHeightForBaseline = getBarChartItemHeight({baseline});

	const listAnimationContext = useListAnimation({
		width: barsArea.width,
		height: barsArea.height,
		transitions,
		itemHeight: ibcsItemHeightForBaseline, // TODO actually itemHeightFrom itemHeightTo in transitions optionally to override this
		fitItemHeights: true,
		easing,
		justifyContent: 'center',
	});

	const listTransitionContext = listAnimationContext.currentTransitionContext;

	const barChartTransitionContext = useBarChartTransition({
		listTransitionContext,
		baseline,
		labelWidth: labelWidth || 0,
		valueLabelWidth: valueLabelWidth || 0,
		negativeValueLabelWidth: negativeValueLabelWidth || 0,
		// globalCustomDomain: [-100, 100],
	});

	return (
		<>
			{/* measure labels */}
			<MeasureLabels
				key="labelMeasurement"
				ref={labelsRef}
				data={[...manyItemsWithNegatives, ...fewItemsWithJustPositives]}
				theme={theme}
				baseline={baseline}
				Component={MeasureLabelComponent}
			/>

			{/* measure positive value labels */}
			<MeasureValueLabels
				key="valueLabelMeasurement"
				ref={valueLabelsRef}
				data={[...manyItemsWithNegatives, ...fewItemsWithJustPositives].filter(
					(it) => it.value >= 0
				)}
				theme={theme}
				baseline={baseline}
				Component={MeasureValueLabelComponent}
			/>
			{/* measure negative value labels */}
			<MeasureValueLabels
				key="negativeValueLabelMeasurement"
				ref={negativeValueLabelsRef}
				data={[...manyItemsWithNegatives, ...fewItemsWithJustPositives].filter(
					(it) => it.value < 0
				)}
				theme={theme}
				baseline={baseline}
				Component={MeasureValueLabelComponent}
			/>

			{isNumber(labelWidth) &&
			isNumber(valueLabelWidth) &&
			isNumber(negativeValueLabelWidth) ? (
				<div style={{position: 'relative'}}>
					{showLayout ? (
						<div style={{position: 'absolute', top: 0, left: 0}}>
							<DisplayGridRails {...matrixLayout} />
						</div>
					) : null}

					<HtmlArea area={barsArea}>
						<BarsTransition
							showLayout={showLayout}
							listTransitionContext={listTransitionContext}
							barChartTransitionContext={barChartTransitionContext}
							LabelComponent={DefaultLabelComponent}
							ValueLabelComponent={DefaultValueLabelComponent}
							theme={theme}
							baseline={baseline}
						/>
					</HtmlArea>

					{(() => {
						const realXAxisArea = {
							y1: 0,
							y2: xAxisArea.height,
							x1: barChartTransitionContext.barChartItemLayout.barArea.x1,
							x2: barChartTransitionContext.barChartItemLayout.barArea.x2,
							height: xAxisArea.height,
							width: barChartTransitionContext.barChartItemLayout.barArea.width,
						};

						return (
							<HtmlArea area={xAxisArea}>
								<XAxisTransition
									listTransitionContext={listTransitionContext}
									barChartTransitionContext={barChartTransitionContext}
									theme={theme}
									baseline={baseline}
									area={realXAxisArea}
								/>
							</HtmlArea>
						);
					})()}
				</div>
			) : null}
		</>
	);
};

const manyItemsWithNegatives = [
	{
		id: 'Id-001',
		label: 'Item 001',
		value: 10,
		color: '#FF5733',
	},
	{
		id: 'Id-002',
		label: 'Item 002',
		value: 20.5,
		color: '#33FF57',
	},
	{
		id: 'Id-003',
		label: 'Item 003',
		value: 30.75,
		color: '#3357FF',
	},
	{
		id: 'Id-004',
		label: 'Item 004',
		value: -40.25,
		color: '#FF33A1',
	},
	{
		id: 'Id-011',
		label: 'Item 011',
		value: -55.1,
		color: '#A133FF',
	},
	{
		id: 'Id-005',
		label: 'Item 005',
		value: -25.3,
		color: '#33FFF3',
	},
	{
		id: 'Id-006',
		label: 'Item 006',
		value: 60.6,
		color: '#FFC733',
	},
	{
		id: 'Id-007',
		label: 'Item 007',
		value: 35.8,
		color: '#C7FF33',
	},
	{
		id: 'Id-010',
		label: 'Item 010',
		value: 45.9,
		color: '#5733FF',
	},
];

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
