import React, {useCallback, useMemo} from 'react';
import {useVideoConfig, Easing} from 'remotion';
import {isNumber} from 'lodash';

import {TypographyStyle} from '../../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {TBarChartItem} from '../packages/BarChartAnimation/useBarChartTransition/useBarChartTransition';
import {getPerfectBaselineForHeight} from '../packages/BarChartAnimation/getPerfectBaselineForHeight';
import {XAxisTransition} from '../packages/BarChartAnimation/XAxisTransition/XAxisTransition';
import {useElementDimensions} from '../../../03-Page/SimplePage/useElementDimensions';
import {HtmlArea, DisplayGridRails} from '../../../../../acetti-layout';
import {
	getMatrixLayoutCellArea,
	useMatrixLayout,
} from '../../../../../acetti-layout/hooks/useMatrixLayout';
import {
	useListAnimation,
	ListAnimationTransition,
} from '../packages/ListAnimation/useListAnimation';
import {BarsTransition} from '../packages/BarChartAnimation/BarsTransition/BarsTransition';
import {useBarChartTransition} from '../packages/BarChartAnimation/useBarChartTransition/useBarChartTransition';
import {getBarChartItemHeight} from '../packages/BarChartAnimation/useBarChartTransition/getBarChartItemLayout';
import {
	// DefaultValueLabelComponent,
	getDefaultValueLabelComponent,
	MeasureValueLabels,
	TBarChartValueLabelComponent,
} from '../packages/BarChartAnimation/BarsTransition/ValueLabelComponent';
import {
	DefaultLabelComponent,
	MeasureLabels,
	TBarChartLabelComponent,
} from '../packages/BarChartAnimation/BarsTransition/LabelComponent';
import {ThemeType} from '../../../../../acetti-themes/themeTypes';
import {
	getXAxisHeight,
	getXAxisMarginTop,
} from '../packages/BarChartAnimation/XAxisTransition/getStyles_XAxis';

type TBarChartRaceData = {
	periodLabel: string;
	data: {
		id: string;
		label: string;
		value: number;
		color: string;
	}[];
}[];

export const SimpleBarChartRace: React.FC<{
	baseline?: number;
	height: number;
	width: number;
	theme: ThemeType;
	fitItemsHeight?: boolean;
	showLayout?: boolean;
	justifyContent?: 'center' | 'start';
	domain?: [number, number];
	labelWidth?: number;
	valueLabelWidth?: number;
	negativeValueLabelWidth?: number;
	forceNegativeValueLabelWidth?: boolean;
	nrTicks?: number;
	hideAxis?: boolean;
	hideLabel?: boolean;
	hideValueLabel?: boolean;
	valueLabelFormatter?: (value: number) => string;
	tickLabelFormatter?: (value: number) => string;
	LabelComponent?: TBarChartLabelComponent;
	ValueLabelComponent?: TBarChartValueLabelComponent;
	barChartRaceData: TBarChartRaceData;
}> = ({
	barChartRaceData,
	// dataItems,
	baseline: baselineProp,
	height,
	width,
	theme,
	justifyContent = 'center',
	showLayout = false,
	fitItemsHeight = false,
	domain,
	labelWidth: labelWidthProp,
	valueLabelWidth: valueLabelWidthProp,
	negativeValueLabelWidth: negativeValueLabelWidthProp,
	forceNegativeValueLabelWidth = false,
	nrTicks,
	hideAxis = false,
	hideLabel = false,
	hideValueLabel = false,
	valueLabelFormatter,
	tickLabelFormatter,
	LabelComponent: LabelComponentProp,
	ValueLabelComponent: ValueLabelComponentProp,
}) => {
	const {durationInFrames, fps} = useVideoConfig();

	const ibcsSizesSpecFromTheme = theme.ibcsSizes.barChartItem;

	if (hideLabel) {
		ibcsSizesSpecFromTheme.columns.labelMargin = 0;
	}
	if (hideValueLabel) {
		ibcsSizesSpecFromTheme.columns.valueLabelMargin = 0;
	}

	const LabelComponent = useMemo(
		() =>
			hideLabel ? () => null : LabelComponentProp || DefaultLabelComponent,
		[hideLabel, LabelComponentProp]
	);

	const ValueLabelComponent = useMemo(
		() =>
			hideValueLabel
				? () => null
				: ValueLabelComponentProp ||
				  getDefaultValueLabelComponent({
						numberFormatter: valueLabelFormatter,
				  }),
		[hideValueLabel, ValueLabelComponentProp, valueLabelFormatter]
	);

	const MOST_ITEMS_AT_ONCE = Math.max(
		...barChartRaceData.map((it) => it.data.length)
	);

	const baseline = baselineProp
		? baselineProp
		: getPerfectBaselineForHeight({
				theme,
				nrItems: MOST_ITEMS_AT_ONCE,
				height,
				hideAxis,
				ibcsSizesSpec: ibcsSizesSpecFromTheme,
		  });

	const xAxisHeight = hideAxis ? 0 : getXAxisHeight({theme, baseline});
	const xAxisMarginTop = hideAxis ? 0 : getXAxisMarginTop({baseline});

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
		({id, value, label}: {id: string; value: number; label: string}) => {
			return (
				<ValueLabelComponent
					id={id}
					value={value}
					label={label}
					baseline={baseline}
					theme={theme}
					animateEnter={false}
					animateExit={false}
				/>
			);
		},
		[baseline, theme, ValueLabelComponent]
	);

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

	const duration_entry = Math.floor(fps * 3.5);
	const provisory_duration_exit = Math.floor(fps * 5);
	const duration_single_transition = Math.floor(
		(durationInFrames - provisory_duration_exit - duration_entry) /
			(barChartRaceData.length - 1)
	);
	const duration_exit =
		durationInFrames -
		duration_entry -
		(barChartRaceData.length - 1) * duration_single_transition;

	// const easing = Easing.bezier(0.16, 1, 0.3, 1); // easeOutExpo
	const easing = Easing.bounce;
	// const easing = easeInElastic;

	const transitions: ListAnimationTransition<TBarChartItem>[] =
		barChartRaceData.map((it, i) => ({
			itemsTo: it.data,
			durationInFrames: i === 0 ? duration_entry : duration_single_transition,
		}));

	transitions.push({
		itemsTo: [],
		durationInFrames: duration_exit,
	});

	const ibcsItemHeightForBaseline = getBarChartItemHeight({
		baseline,
		ibcsSizesSpec: ibcsSizesSpecFromTheme,
	});

	const listAnimationContext = useListAnimation({
		direction: 'vertical',
		width: barsArea.width,
		height: barsArea.height,
		transitions,
		itemSize: ibcsItemHeightForBaseline,
		fitItemSizes: fitItemsHeight,
		easing,
		justifyContent,
	});

	const listTransitionContext = listAnimationContext.currentTransitionContext;

	const barChartTransitionContext = useBarChartTransition({
		listTransitionContext,
		baseline,
		labelWidth: labelWidth || 0,
		valueLabelWidth: valueLabelWidth || 0,
		negativeValueLabelWidth: negativeValueLabelWidth || 0,
		globalCustomDomain: domain, // TODO rename to domain
		forceNegativeValueLabelWidth,
		ibcsSizesSpec: ibcsSizesSpecFromTheme,
	});

	const allDataItems = useMemo(
		() => barChartRaceData.map((it) => it.data).flat(),
		[barChartRaceData]
	);

	const currentPeriodLabel =
		barChartRaceData[listAnimationContext.currentTransitionIndex]
			?.periodLabel ||
		barChartRaceData[barChartRaceData.length - 1].periodLabel;

	const hasBeenMeasured =
		isNumber(labelWidth) &&
		isNumber(valueLabelWidth) &&
		isNumber(negativeValueLabelWidth);

	return (
		<>
			{hasBeenMeasured ? null : (
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
				</>
			)}

			{hasBeenMeasured ? (
				<div>
					<div style={{position: 'relative'}}>
						{showLayout ? <DisplayGridRails {...matrixLayout} /> : null}

						<HtmlArea area={barsArea}>
							<div
								style={{
									position: 'absolute',
									bottom:
										barChartTransitionContext.barChartItemLayout.gridLayout
											.height -
										barChartTransitionContext.barChartItemLayout.barArea.y2,
									right: 0,
								}}
							>
								<TypographyStyle
									typographyStyle={theme.typography.textStyles.h1}
									baseline={baseline}
									color={theme.data.grays[800]}
								>
									{currentPeriodLabel}
								</TypographyStyle>
							</div>
						</HtmlArea>

						<HtmlArea area={barsArea}>
							<BarsTransition
								showLayout={showLayout}
								listTransitionContext={listTransitionContext}
								barChartTransitionContext={barChartTransitionContext}
								LabelComponent={LabelComponent}
								ValueLabelComponent={ValueLabelComponent}
								theme={theme}
								baseline={baseline}
							/>
						</HtmlArea>

						{/* </HtmlArea> */}

						{hideAxis
							? null
							: (() => {
									const realXAxisArea = {
										y1: 0,
										y2: xAxisArea.height,
										x1: barChartTransitionContext.barChartItemLayout.barArea.x1,
										x2: barChartTransitionContext.barChartItemLayout.barArea.x2,
										height: xAxisArea.height,
										width:
											barChartTransitionContext.barChartItemLayout.barArea
												.width,
									};

									return (
										<HtmlArea area={xAxisArea}>
											<XAxisTransition
												listTransitionContext={listTransitionContext}
												barChartTransitionContext={barChartTransitionContext}
												theme={theme}
												baseline={baseline}
												area={realXAxisArea}
												nrTicks={nrTicks}
												tickLabelFormatter={tickLabelFormatter}
											/>
										</HtmlArea>
									);
							  })()}
					</div>
				</div>
			) : null}
		</>
	);
};
