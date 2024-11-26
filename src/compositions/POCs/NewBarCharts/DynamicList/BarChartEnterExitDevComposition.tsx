import {z} from 'zod';
import React, {useCallback} from 'react';
import {useVideoConfig, Easing} from 'remotion';
import {isNumber} from 'lodash';

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
import {BarsTransition} from './packages/BarChartAnimation/BarsTransition/BarsTransition';
import {TBarChartItem} from './packages/BarChartAnimation/useBarChartTransition/useBarChartTransition';
import {
	getBarChartItemHeight,
	useBarChartTransition,
} from './packages/BarChartAnimation/useBarChartTransition/useBarChartTransition';
import {
	DefaultValueLabelComponent,
	MeasureValueLabels,
} from './packages/BarChartAnimation/BarsTransition/ValueLabelComponent';
import {
	DefaultLabelComponent,
	MeasureLabels,
} from './packages/BarChartAnimation/BarsTransition/LabelComponent';

export const barChartEnterExitDevCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const BarChartEnterExitDevComposition: React.FC<
	z.infer<typeof barChartEnterExitDevCompositionSchema>
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
	const {theme, baseline, contentWidth, contentHeight} = usePage();
	const {durationInFrames, fps} = useVideoConfig();

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
		width: area_3.width,
		height: area_3.height,
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

			{isNumber(labelWidth) &&
			isNumber(valueLabelWidth) &&
			isNumber(negativeValueLabelWidth) ? (
				<>
					<Page>
						<TypographyStyle
							typographyStyle={theme.typography.textStyles.h1}
							baseline={baseline}
							marginBottom={2}
						>
							Bar Chart Enter Exit Dev
						</TypographyStyle>

						<div style={{position: 'relative'}}>
							<HtmlArea area={area_3}>
								<BarsTransition
									showLayout
									listTransitionContext={listTransitionContext}
									barChartTransitionContext={barChartTransitionContext}
									LabelComponent={DefaultLabelComponent}
									ValueLabelComponent={DefaultValueLabelComponent}
									//
									enterKeyframes={enterKeyframes}
									exitKeyframes={exitKeyframes}
									//
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

// const idColorMap: {[key: string]: string} = {
// 	'Id-001': '#007bff', // Neon Blue
// 	'Id-002': '#ff4500', // Neon Orange
// 	'Id-003': '#39ff14', // Neon Green
// 	'Id-004': '#ff073a', // Neon Red
// 	'Id-005': '#9d00ff', // Neon Purple
// 	'Id-006': '#a0522d', // Neon Brown (Slightly brighter)
// 	'Id-007': '#ff00ff', // Neon Pink
// 	'Id-008': '#8c8c8c', // Neon Gray
// 	'Id-009': '#d4ff00', // Neon Yellow-Green
// 	'Id-010': '#00ffff', // Neon Teal
// 	'Id-011': '#5b9bff', // Neon Light Blue
// 	'Id-012': '#ff8300', // Neon Light Orange
// 	'Id-013': '#aaff66', // Neon Light Green
// 	'Id-014': '#ff5e5e', // Neon Light Red
// 	'Id-015': '#bf80ff', // Neon Light Purple
// 	'Id-016': '#e5b98e', // Neon Light Brown
// 	'Id-017': '#ff85c2', // Neon Light Pink
// 	'Id-018': '#d3d3d3', // Neon Light Gray
// 	'Id-019': '#eaff00', // Neon Light Yellow-Green
// 	'Id-020': '#6effff', // Neon Light Teal
// };

// /**
//  * Returns a unique, predefined color for the given Id.
//  * @param id - The string Id (e.g., "Id-001", "Id-002").
//  * @returns The hex color as a string.
//  */
// function getPredefinedColor(id: string): string {
// 	return idColorMap[id] || 'magenta'; // Default to black if ID is not found
// }
