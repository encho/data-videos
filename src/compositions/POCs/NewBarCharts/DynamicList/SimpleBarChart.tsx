import {z} from 'zod';
import React, {useCallback} from 'react';
import {useVideoConfig, Easing} from 'remotion';
import {isNumber} from 'lodash';

import {TBarChartItem} from './packages/BarChartAnimation/useBarChartTransition/useBarChartTransition';
import {getPerfectBaselineForHeight} from './packages/BarChartAnimation/getPerfectBaselineForHeight';
import {XAxisTransition} from './packages/BarChartAnimation/XAxisTransition/XAxisTransition';
import {useElementDimensions} from '../../03-Page/SimplePage/useElementDimensions';
import {zThemeEnum} from '../../../../acetti-themes/getThemeFromEnum';
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
import {useBarChartTransition} from './packages/BarChartAnimation/useBarChartTransition/useBarChartTransition';
import {getBarChartItemHeight} from './packages/BarChartAnimation/useBarChartTransition/getBarChartItemLayout';
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

export const useCasesSimpleBarChartCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const SimpleBarChart: React.FC<{
	baseline?: number;
	height: number;
	width: number;
	theme: ThemeType;
	dataItems: TBarChartItem[];
	showLayout?: boolean;
}> = ({
	baseline: baselineProp,
	height,
	width,
	theme,
	showLayout = false,
	dataItems,
}) => {
	const {durationInFrames, fps} = useVideoConfig();

	const LabelComponent = DefaultLabelComponent;
	const ValueLabelComponent = DefaultValueLabelComponent;

	const MOST_ITEMS_AT_ONCE = dataItems.length;

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

	const duration_enter = Math.floor(fps * 3);
	const duration_exit = durationInFrames - duration_enter;

	// const easing = Easing.bezier(0.16, 1, 0.3, 1); // easeOutExpo
	const easing = Easing.bounce;

	const transitions: ListAnimationTransition<TBarChartItem>[] = [
		{
			itemsTo: dataItems,
			durationInFrames: duration_enter,
		},
		{
			itemsTo: [],
			durationInFrames: duration_exit,
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
				data={dataItems}
				theme={theme}
				baseline={baseline}
				Component={MeasureLabelComponent}
			/>

			{/* measure positive value labels */}
			<MeasureValueLabels
				key="valueLabelMeasurement"
				ref={valueLabelsRef}
				data={dataItems.filter((it) => it.value >= 0)}
				theme={theme}
				baseline={baseline}
				Component={MeasureValueLabelComponent}
			/>
			{/* measure negative value labels */}
			<MeasureValueLabels
				key="negativeValueLabelMeasurement"
				ref={negativeValueLabelsRef}
				data={dataItems.filter((it) => it.value < 0)}
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
