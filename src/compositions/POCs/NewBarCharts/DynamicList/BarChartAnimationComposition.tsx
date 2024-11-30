import {z} from 'zod';
import React, {useCallback} from 'react';
import {useVideoConfig, Easing} from 'remotion';
import {isNumber} from 'lodash';

import {useElementDimensions} from '../../03-Page/SimplePage/useElementDimensions';
import {Value, Row} from '../../09-Timeseries/utils/InspectorTools';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {Page} from '../../../../acetti-components/Page';
import {PageContext, usePage} from '../../../../acetti-components/PageContext';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {DisplayGridRails} from '../../../../acetti-layout';
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
import {getBarChartItemHeight} from './packages/BarChartAnimation/useBarChartTransition/getBarChartItemLayout';
import {useBarChartTransition} from './packages/BarChartAnimation/useBarChartTransition/useBarChartTransition';
import {
	getDefaultValueLabelComponent,
	MeasureValueLabels,
} from './packages/BarChartAnimation/BarsTransition/ValueLabelComponent';
import {
	DefaultLabelComponent,
	MeasureLabels,
} from './packages/BarChartAnimation/BarsTransition/LabelComponent';

export const barChartAnimationCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const BarChartAnimationComposition: React.FC<
	z.infer<typeof barChartAnimationCompositionSchema>
> = ({themeEnum}) => {
	const theme = useThemeFromEnum(themeEnum);
	const {width, height} = useVideoConfig();

	return (
		<div style={{position: 'relative'}}>
			<PageContext
				margin={50}
				nrBaselines={40}
				width={width}
				height={height * 0.32}
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
	const ValueLabelComponent = getDefaultValueLabelComponent({});

	const ibcsSizesSpec = theme.ibcsSizes.barChartItem;

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
		height: contentHeight - 120,
		nrColumns: 3,
		nrRows: 1,
		rowSpacePixels: 0,
		columnSpacePixels: 50,
		rowPaddingPixels: 0,
		columnPaddingPixels: 0,
		columnSizes: [
			{type: 'fr', value: 1},
			{type: 'fr', value: 1},
			{type: 'fr', value: 2},
		],
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
		row: 0,
		column: 2,
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

	const ibcsItemHeightForBaseline = getBarChartItemHeight({
		baseline,
		ibcsSizesSpec,
	});

	const listAnimationContextForDebug = useListAnimation({
		width: area_1.width,
		height: area_1.height,
		transitions,
		itemHeight: ibcsItemHeightForBaseline, // TODO actually itemHeightFrom itemHeightTo in transitions optionally to override this
		fitItemHeights: false,
		easing,
		justifyContent: 'center',
	});

	const listTransitionContextForDebug =
		listAnimationContextForDebug.currentTransitionContext;

	const listAnimationContext = useListAnimation({
		width: area_3.width,
		height: area_3.height,
		transitions,
		itemHeight: ibcsItemHeightForBaseline, // TODO actually itemHeightFrom itemHeightTo in transitions optionally to override this
		fitItemHeights: false,
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
		ibcsSizesSpec,
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
				<>
					<Page>
						<TypographyStyle
							typographyStyle={theme.typography.textStyles.h1}
							baseline={baseline}
							marginBottom={2}
						>
							Bar Chart Animation Demo
						</TypographyStyle>

						<div style={{position: 'relative'}}>
							{listTransitionContextForDebug.transitionType === 'update' ||
							listTransitionContextForDebug.transitionType === 'exit' ? (
								<HtmlArea area={area_1} fill="rgba(255,0,255,0.15)">
									<DisplayGridRails
										{...listTransitionContextForDebug.from.layout.gridLayout}
										stroke="rgba(255,0,255,1)"
									/>
									{listTransitionContextForDebug.from.items.map((it) => {
										const area =
											listTransitionContextForDebug.from.getListItemArea(it.id);

										const idColor = getPredefinedColor(it.id);

										const isVisible = isIdInItems(
											it.id,
											listTransitionContextForDebug.from.visibleItems
										);

										return (
											<HtmlArea
												key={it.id}
												area={area}
												fill={isVisible ? idColor : 'rgba(0,0,0,0.3)'}
											>
												<TypographyStyle
													typographyStyle={theme.typography.textStyles.body}
													baseline={baseline}
												>
													{it.id}
												</TypographyStyle>
											</HtmlArea>
										);
									})}
								</HtmlArea>
							) : null}

							{listTransitionContextForDebug.transitionType === 'update' ||
							listTransitionContextForDebug.transitionType === 'enter' ? (
								<HtmlArea area={area_2} fill="rgba(255,0,255,0.15)">
									<DisplayGridRails
										{...listTransitionContextForDebug.to.layout.gridLayout}
										stroke="rgba(255,0,255,1)"
									/>
									{listTransitionContextForDebug.to.items.map((it) => {
										const area =
											listTransitionContextForDebug.to.getListItemArea(it.id);
										const idColor = getPredefinedColor(it.id);

										const isVisible = isIdInItems(
											it.id,
											listTransitionContextForDebug.to.visibleItems
										);

										return (
											<HtmlArea
												key={it.id}
												area={area}
												fill={isVisible ? idColor : 'rgba(0,0,0,0.3)'}
											>
												<TypographyStyle
													typographyStyle={theme.typography.textStyles.body}
													baseline={baseline}
												>
													{it.id}
												</TypographyStyle>
											</HtmlArea>
										);
									})}
								</HtmlArea>
							) : null}

							<HtmlArea area={area_3} fill="rgba(255,0,255,0.15)">
								<BarsTransition
									showLayout
									listTransitionContext={listTransitionContext}
									barChartTransitionContext={barChartTransitionContext}
									LabelComponent={LabelComponent}
									ValueLabelComponent={ValueLabelComponent}
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
							{({baseline}) => {
								const FONT_SIZE = baseline;
								return (
									<div style={{fontSize: FONT_SIZE}}>
										<Row>LIST ANIMATION CONTEXT</Row>
										<div>
											<Row>
												<div>numberOfTransitions</div>
												<Value>
													{listAnimationContext.numberOfTransitions}
												</Value>
											</Row>
											<Row>
												<div>currentTransitionIndex</div>
												<Value>
													{listAnimationContext.currentTransitionIndex}
												</Value>
											</Row>
											<Row>
												<div>frame</div>
												<Value>{listAnimationContext.frame}</Value>
											</Row>
											<Row>
												<div>durationInFrames</div>
												<Value>{listAnimationContext.durationInFrames}</Value>
											</Row>
											<Row>
												<Row>CURRENT TRANSITION CONTEXT</Row>
												<div>
													<Row>
														<div>(relative) frame</div>
														<Value>
															{
																listAnimationContext.currentTransitionContext
																	.frame
															}
														</Value>
													</Row>
													<Row>
														<div>transitionType</div>
														<Value>
															{
																listAnimationContext.currentTransitionContext
																	.transitionType
															}
														</Value>
													</Row>
													<Row>
														<div>[...]</div>
													</Row>
												</div>
											</Row>

											<Row>
												<Row> TRANSITIONS</Row>

												<div>
													{listAnimationContext.transitions.map(
														(editedTransition, i) => {
															const isActive =
																listAnimationContext.currentTransitionIndex ===
																i;
															return (
																<div
																	key={i}
																	style={{
																		margin: 10,
																		backgroundColor: '#660000',
																		border: isActive ? '2px solid orange' : '',
																	}}
																>
																	<Row>
																		<div>frameRange</div>
																		<Value>
																			{JSON.stringify(
																				editedTransition.frameRange
																			)}
																		</Value>
																	</Row>
																	<Row>
																		<div>from.itemHeight</div>
																		<Value>
																			{JSON.stringify(
																				editedTransition.from.itemHeight
																			)}
																		</Value>
																	</Row>
																	<Row>
																		<div>nr of visible items FROM</div>
																		<Value>
																			{JSON.stringify(
																				editedTransition.from.visibleItems
																					.length
																			)}
																		</Value>
																	</Row>
																	<Row>
																		<div>nr of visible items TO</div>
																		<Value>
																			{JSON.stringify(
																				editedTransition.to.visibleItems.length
																			)}
																		</Value>
																	</Row>
																	<Row>
																		<div>to.itemHeight</div>
																		<Value>
																			{JSON.stringify(
																				editedTransition.to.itemHeight
																			)}
																		</Value>
																	</Row>
																	<Row>
																		<div>[...]</div>
																	</Row>
																</div>
															);
														}
													)}
												</div>
											</Row>
										</div>
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
		color: '#3357FF',
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
].map((it) => ({...it, color: getPredefinedColor(it.id)}));

const fewItemsWithJustPositives = [
	{
		id: 'Id-009',
		label: 'Item 009',
		value: 70,
	},
	{
		id: 'Id-003',
		label: 'Item 003',
		value: 30.75,
	},
	{
		id: 'Id-007',
		label: 'Item 007',
		value: 20.8,
	},
	{
		id: 'Id-002',
		label: 'Item 002',
		value: 20.5,
	},
	{
		id: 'Id-005',
		label: 'Item 005',
		value: 33.3,
	},
	{
		id: 'Id-001',
		label: 'Item 001',
		value: 12,
	},
].map((it) => ({...it, color: getPredefinedColor(it.id)}));

type Item = {id: string};

/**
 * Checks if a given string is an `id` in the provided array of items.
 * @param items - Array of Item objects.
 * @param id - The string to check.
 * @returns `true` if the string is found as an `id` in the items, otherwise `false`.
 */
function isIdInItems(id: string, items: Item[]): boolean {
	return items.some((item) => item.id === id);
}
// // Example usage
// const items: Item[] = [
//   { id: "001" },
//   { id: "002" },
//   { id: "003" },
//   { id: "004" },
//   { id: "005" }
// ];
// console.log(isIdInItems("003",items)); // true
// console.log(isIdInItems("007",items)); // false

/**
 * Returns a unique, predefined color for the given Id.
 * @param id - The string Id (e.g., "Id-001", "Id-002").
 * @returns The hex color as a string.
 */
function getPredefinedColor(id: string): string {
	const idColorMap: {[key: string]: string} = {
		'Id-001': '#007bff', // Neon Blue
		'Id-002': '#ff4500', // Neon Orange
		'Id-003': '#39ff14', // Neon Green
		'Id-004': '#ff073a', // Neon Red
		'Id-005': '#9d00ff', // Neon Purple
		'Id-006': '#a0522d', // Neon Brown (Slightly brighter)
		'Id-007': '#ff00ff', // Neon Pink
		'Id-008': '#8c8c8c', // Neon Gray
		'Id-009': '#d4ff00', // Neon Yellow-Green
		'Id-010': '#00ffff', // Neon Teal
		'Id-011': '#5b9bff', // Neon Light Blue
		'Id-012': '#ff8300', // Neon Light Orange
		'Id-013': '#aaff66', // Neon Light Green
		'Id-014': '#ff5e5e', // Neon Light Red
		'Id-015': '#bf80ff', // Neon Light Purple
		'Id-016': '#e5b98e', // Neon Light Brown
		'Id-017': '#ff85c2', // Neon Light Pink
		'Id-018': '#d3d3d3', // Neon Light Gray
		'Id-019': '#eaff00', // Neon Light Yellow-Green
		'Id-020': '#6effff', // Neon Light Teal
	};

	return idColorMap[id] || 'magenta'; // Default to black if ID is not found
}
