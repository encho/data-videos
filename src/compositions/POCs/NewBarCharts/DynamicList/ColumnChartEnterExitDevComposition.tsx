import {z} from 'zod';
import React, {useCallback} from 'react';
import {useVideoConfig, Easing} from 'remotion';
import {isNumber} from 'lodash';

import {useColumnChartTransition} from './packages/ColumnChartAnimation/useColumnChartTransition/useColumnChartTransition';
import {KeyFramesInspector} from '../../Keyframes/Keyframes/KeyframesInspector';
import {
	getEnterKeyframes,
	getExitKeyframes,
} from './packages/BarChartAnimation/BarsTransition/getKeyframes';
import {useElementDimensions} from '../../03-Page/SimplePage/useElementDimensions';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {Page} from '../../../../acetti-components/Page';
import {PageContext, usePage} from '../../../../acetti-components/PageContext';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {HtmlArea} from '../../../../acetti-layout';
import {
	getMatrixLayoutCellArea,
	useMatrixLayout,
} from '../../../../acetti-layout/hooks/useMatrixLayout';
import {
	useListAnimation,
	ListAnimationTransition,
} from './packages/ListAnimation/useListAnimation';
import {TColumnChartItem} from './packages/ColumnChartAnimation/useColumnChartTransition/useColumnChartTransition';
import {ColumnsTransition} from './packages/ColumnChartAnimation/ColumnsTransition/ColumnsTransition';
import {
	getDefaultValueLabelComponent,
	MeasureValueLabels,
} from './packages/ColumnChartAnimation/ColumnsTransition/ValueLabelComponent';
import {
	DefaultLabelComponent,
	MeasureLabels,
} from './packages/ColumnChartAnimation/ColumnsTransition/LabelComponent';
import {getColumnChartItemWidth} from './packages/ColumnChartAnimation/useColumnChartTransition/getColumnChartItemLayout';

export const columnChartEnterExitDevCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const ColumnChartEnterExitDevComposition: React.FC<
	z.infer<typeof columnChartEnterExitDevCompositionSchema>
> = ({themeEnum}) => {
	const theme = useThemeFromEnum(themeEnum);
	const {width, height} = useVideoConfig();

	return (
		<div style={{position: 'relative'}}>
			<PageContext
				margin={50}
				nrBaselines={50}
				width={width}
				height={height * 0.5}
				theme={theme}
			>
				<ListAnimationPage />
			</PageContext>
		</div>
	);
};

export const ListAnimationPage: React.FC = () => {
	const {theme, contentWidth, contentHeight} = usePage();
	const {durationInFrames, fps} = useVideoConfig();

	const baseline = 30;

	const ibcsSizesSpec = theme.ibcsSizes.columnChartItem;
	const ibcsSizesSpec_COLUMNS = theme.ibcsSizes.columnChartItem;

	const LabelComponent = DefaultLabelComponent;
	const ValueLabelComponent = getDefaultValueLabelComponent({});

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

	const labelHeightProp = undefined;
	const labelHeight = labelHeightProp || labelsDimensions?.height;

	const valueLabelHeightProp = undefined;
	const valueLabelHeight =
		valueLabelHeightProp || valueLabelsDimensions?.height;

	const negativeValueLabelHeightProp = undefined;
	const negativeValueLabelHeight =
		negativeValueLabelHeightProp || negativeValueLabelsDimensions?.height;

	const matrixLayout = useMatrixLayout({
		width: contentWidth,
		height: contentHeight - 180,
		nrColumns: 1,
		nrRows: 1,
		rowSpacePixels: 0,
		columnSpacePixels: 50,
		rowPaddingPixels: 0,
		columnPaddingPixels: 0,
		columnSizes: [{type: 'fr', value: 1}],
	});
	const area_3 = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 0,
		column: 0,
	});

	const duration_0 = Math.floor(fps * 3);
	const duration_1 = Math.floor(durationInFrames / 5);
	const duration_2 = Math.floor(durationInFrames / 5);
	const duration_3 = Math.floor(durationInFrames / 5);
	const duration_4 =
		durationInFrames - duration_0 - duration_1 - duration_2 - duration_3;

	const easing = Easing.bezier(0.16, 1, 0.3, 1); // easeOutExpo
	// const easing = Easing.bounce;

	const transitions: ListAnimationTransition<TColumnChartItem>[] = [
		{
			itemsTo: fewItemsWithJustPositives,
			durationInFrames: duration_0,
		},
		{
			itemsTo: manyItemsWithNegatives,
			durationInFrames: duration_1,
		},
		{
			itemsTo: fewItemsWithJustPositives,
			durationInFrames: duration_2,
		},
		{
			itemsTo: manyItemsWithNegatives,
			durationInFrames: duration_3,
		},
		{
			itemsTo: [],
			durationInFrames: duration_4,
		},
	];

	const ibcsItemWidthForBaseline = getColumnChartItemWidth({
		baseline,
		ibcsSizesSpec,
	});

	const listAnimationContext = useListAnimation({
		direction: 'horizontal',
		width: area_3.width,
		height: area_3.height,
		transitions,
		itemHeight: ibcsItemWidthForBaseline, // TODO rename to itemSize, as here it refers to the width
		// fitItemSizes: true,
		easing,
		justifyContent: 'center',
	});

	const listTransitionContext = listAnimationContext.currentTransitionContext;

	const columnChartTransitionContext = useColumnChartTransition({
		listTransitionContext,
		baseline,
		labelHeight: labelHeight || 0,
		valueLabelHeight: valueLabelHeight || 0,
		negativeValueLabelHeight: negativeValueLabelHeight || 0,
		// forceNegativeValueLabelHeight: true,
		ibcsSizesSpec: ibcsSizesSpec_COLUMNS,
		// globalCustomDomain: [-100, 100],
	});

	const isFirstTransition = listAnimationContext.currentTransitionIndex === 0;

	const isLastTransition =
		listAnimationContext.currentTransitionIndex ===
		listAnimationContext.numberOfTransitions - 1;

	// define the "enter" keyframes here and pass them in
	const firstTransition = listAnimationContext.transitions[0];
	const {
		durationInFrames: durationInFrames_1,
		to: {items: dataItems_1},
	} = firstTransition;

	const enterKeyframes = getEnterKeyframes({
		fps,
		durationInFrames: durationInFrames_1,
		data: dataItems_1,
	});

	// define the "enter" keyframes here and pass them in
	const lastTransition =
		listAnimationContext.transitions[
			listAnimationContext.transitions.length - 1
		];
	const {
		durationInFrames: durationInFrames_last,
		from: {items: dataItems_last},
	} = lastTransition;

	const exitKeyframes = getExitKeyframes({
		fps,
		durationInFrames: durationInFrames_last,
		data: dataItems_last,
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

			{isNumber(labelHeight) &&
			isNumber(valueLabelHeight) &&
			isNumber(negativeValueLabelHeight) ? (
				<>
					<Page>
						<TypographyStyle
							typographyStyle={theme.typography.textStyles.h1}
							// baseline={baseline}
							marginBottom={2}
						>
							Column Chart Enter Exit Dev
						</TypographyStyle>

						<div style={{position: 'relative'}}>
							<HtmlArea area={area_3}>
								<ColumnsTransition
									showLayout
									listTransitionContext={listTransitionContext}
									columnChartTransitionContext={columnChartTransitionContext}
									LabelComponent={LabelComponent}
									ValueLabelComponent={ValueLabelComponent}
									enterKeyframes={enterKeyframes}
									exitKeyframes={exitKeyframes}
									theme={theme}
									baseline={baseline}
								/>
							</HtmlArea>
						</div>
					</Page>

					<PageContext
						margin={0}
						nrBaselines={30}
						width={contentWidth}
						height={contentHeight}
						theme={theme}
					>
						<Page show>
							{({baseline, contentWidth}) => {
								const FONT_SIZE = baseline;
								return (
									<div style={{fontSize: FONT_SIZE}}>
										{isFirstTransition
											? (() => {
													return (
														<KeyFramesInspector
															theme={theme}
															frame={
																listAnimationContext.currentTransitionContext
																	.frame
															}
															width={contentWidth}
															baseFontSize={20}
															keyFramesGroup={enterKeyframes}
														/>
													);
											  })()
											: null}
										{isLastTransition
											? (() => {
													return (
														<KeyFramesInspector
															theme={theme}
															frame={
																listAnimationContext.currentTransitionContext
																	.frame
															}
															width={contentWidth}
															baseFontSize={20}
															keyFramesGroup={exitKeyframes}
														/>
													);
											  })()
											: null}
									</div>
								);
							}}
						</Page>
					</PageContext>
				</>
			) : null}
		</>
	);
};

const manyItemsWithNegatives = [
	{
		id: 'Id-2016',
		label: '2016',
		value: 10,
		color: '#FF5733',
	},
	{
		id: 'Id-2017',
		label: '2017',
		value: 20.5,
		color: '#33FF57',
	},
	{
		id: 'Id-2018',
		label: '2018',
		value: 30.75,
		color: '#3357FF',
	},
	{
		id: 'Id-2019',
		label: '2019',
		value: 12.25,
		color: '#FF33A1',
	},
	{
		id: 'Id-2020',
		label: '2020',
		value: -25.3,
		color: '#ff0000',
	},
	{
		id: 'Id-2021',
		label: '2021',
		value: 25.3,
		color: '#ffff00',
	},
];

const fewItemsWithJustPositives = [
	{
		id: 'Id-2016',
		label: '2016',
		value: 10,
		color: '#FF5733',
	},
	{
		id: 'Id-2017',
		label: '2017',
		value: 20.5,
		color: '#33FF57',
	},
	{
		id: 'Id-2018',
		label: '2018',
		value: 30.75,
		color: '#3357FF',
	},
	{
		id: 'Id-2019',
		label: '2019',
		value: 12.25,
		color: '#FF33A1',
	},
];
