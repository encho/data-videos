import {z} from 'zod';
import React from 'react';
import {useVideoConfig, Easing} from 'remotion';

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
import {useListAnimation, ListAnimationTransition} from './useListAnimation';
import {
	BarsTransitionUpdate,
	BarsTransitionEnter,
	BarsTransitionExit,
} from './BarsTransition';
import {TBarChartItem} from './useBarChartTransition';
import {
	DefaultLabelComponent,
	// TBarChartLabelComponent,
	DefaultValueLabelComponent,
	// TBarChartValueLabelComponent,
	// MeasureLabels,
	// MeasureValueLabels,
} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';

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
				nrBaselines={50}
				width={width}
				height={height / 2}
				theme={theme}
			>
				<ListAnimationPage />
			</PageContext>
		</div>
	);
};

export const ListAnimationPage: React.FC = () => {
	const {theme, baseline, contentWidth, contentHeight} = usePage();
	const {durationInFrames} = useVideoConfig();

	const matrixLayout = useMatrixLayout({
		width: contentWidth,
		height: contentHeight - 120,
		nrColumns: 3,
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

	const visibleIndicesFrom = [0, 5] as [number, number];
	const visibleIndicesTo = [0, 4] as [number, number];

	const duration_0 = Math.floor(durationInFrames / 5);
	const duration_1 = Math.floor(durationInFrames / 5);
	const duration_2 = Math.floor(durationInFrames / 5);
	const duration_3 = Math.floor(durationInFrames / 5);
	const duration_4 =
		durationInFrames - duration_0 - duration_1 - duration_2 - duration_3;

	const easingFunction = Easing.bezier(0.16, 1, 0.3, 1); // easeOutExpo

	// eslint-disable-next-line
	const weirdTransitions: ListAnimationTransition<TBarChartItem>[] = [
		{
			itemsFrom: [],
			itemsTo: itemsFrom,
			visibleIndicesFrom: [0, 1],
			visibleIndicesTo: [0, 5],
			easingFunction,
			durationInFrames: duration_0,
		},
		{
			itemsFrom,
			itemsTo,
			visibleIndicesFrom,
			visibleIndicesTo,
			easingFunction,
			durationInFrames: duration_1,
		},
		{
			itemsFrom: itemsTo,
			itemsTo: itemsFrom,
			visibleIndicesFrom: visibleIndicesTo,
			visibleIndicesTo: visibleIndicesFrom,
			easingFunction,
			durationInFrames: duration_2,
		},
		{
			itemsFrom,
			itemsTo,
			visibleIndicesFrom,
			visibleIndicesTo: [0, 2],
			easingFunction,
			durationInFrames: duration_3,
		},
		{
			itemsFrom: itemsTo,
			itemsTo: [],
			visibleIndicesFrom: [0, 2],
			visibleIndicesTo: visibleIndicesFrom,
			easingFunction,
			durationInFrames: duration_4,
		},
	];

	// eslint-disable-next-line
	const scrollingTransitions: ListAnimationTransition<TBarChartItem>[] = [
		{
			itemsFrom: [],
			itemsTo: itemsFrom,
			visibleIndicesFrom: [0, 1],
			visibleIndicesTo: [0, 3],
			easingFunction,
			durationInFrames: duration_0,
		},
		{
			itemsFrom,
			itemsTo: itemsFrom,
			visibleIndicesFrom: [0, 3],
			visibleIndicesTo: [2, 5],
			easingFunction,
			durationInFrames: duration_1,
		},
		{
			itemsFrom,
			itemsTo: itemsFrom,
			visibleIndicesFrom: [2, 5],
			visibleIndicesTo: [5, 8],
			easingFunction,
			durationInFrames: duration_2,
		},
		{
			itemsFrom,
			itemsTo: itemsFrom,
			visibleIndicesFrom: [5, 8],
			visibleIndicesTo: [0, 3],
			easingFunction,
			durationInFrames: duration_3,
		},
		{
			itemsFrom,
			itemsTo: [],
			visibleIndicesFrom: [0, 3],
			visibleIndicesTo: visibleIndicesFrom,
			easingFunction,
			durationInFrames: duration_4,
		},
	];

	const listAnimationContext = useListAnimation({
		width: area_1.width,
		height: area_1.height,
		// transitions: weirdTransitions,
		transitions: scrollingTransitions,
		itemHeight: 40,
	});

	const listTransitionContext = listAnimationContext.currentTransitionContext;

	return (
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
					{listTransitionContext.transitionType === 'update' ||
					listTransitionContext.transitionType === 'exit' ? (
						<HtmlArea area={area_1} fill="rgba(255,0,255,0.15)">
							<DisplayGridRails
								{...listTransitionContext.from.layout.gridLayout}
								stroke="rgba(255,0,255,1)"
							/>
							{listTransitionContext.from.items.map((it) => {
								const area = listTransitionContext.from.getListItemArea(it.id);

								const idColor = getPredefinedColor(it.id);

								const isVisible = isIdInItems(
									it.id,
									listTransitionContext.from.visibleItems
								);

								return (
									<HtmlArea
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

					{listTransitionContext.transitionType === 'update' ||
					listTransitionContext.transitionType === 'enter' ? (
						<HtmlArea area={area_2} fill="rgba(255,0,255,0.15)">
							<DisplayGridRails
								{...listTransitionContext.to.layout.gridLayout}
								stroke="rgba(255,0,255,1)"
							/>
							{listTransitionContext.to.items.map((it) => {
								const area = listTransitionContext.to.getListItemArea(it.id);
								const idColor = getPredefinedColor(it.id);

								const isVisible = isIdInItems(
									it.id,
									listTransitionContext.to.visibleItems
								);

								return (
									<HtmlArea
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
						{listTransitionContext.transitionType === 'update' ? (
							<BarsTransitionUpdate
								listTransitionContext={listTransitionContext}
								LabelComponent={DefaultLabelComponent}
								ValueLabelComponent={DefaultValueLabelComponent}
							/>
						) : null}
						{listTransitionContext.transitionType === 'enter' ? (
							<BarsTransitionEnter
								listTransitionContext={listTransitionContext}
							/>
						) : null}
						{listTransitionContext.transitionType === 'exit' ? (
							<BarsTransitionExit
								listTransitionContext={listTransitionContext}
							/>
						) : null}
					</HtmlArea>
				</div>
			</Page>

			<PageContext
				margin={0}
				nrBaselines={50}
				width={contentWidth}
				height={contentHeight}
				theme={theme}
			>
				<Page show>
					<div style={{fontSize: 40}}>
						<Row>LIST ANIMATION CONTEXT</Row>
						<div>
							<Row>
								<div>numberOfTransitions</div>
								<Value>{listAnimationContext.numberOfTransitions}</Value>
							</Row>
							<Row>
								<div>currentTransitionIndex</div>
								<Value>{listAnimationContext.currentTransitionIndex}</Value>
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
											{listAnimationContext.currentTransitionContext.frame}
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
												listAnimationContext.currentTransitionIndex === i;
											return (
												<div
													style={{
														margin: 10,
														backgroundColor: '#660000',
														border: isActive ? '2px solid orange' : '',
													}}
												>
													<Row>
														<div>frameRange</div>
														<Value>
															{JSON.stringify(editedTransition.frameRange)}
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
				</Page>
			</PageContext>
		</>
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

/**
 * Returns a unique, predefined color for the given Id.
 * @param id - The string Id (e.g., "Id-001", "Id-002").
 * @returns The hex color as a string.
 */
function getPredefinedColor(id: string): string {
	return idColorMap[id] || 'magenta'; // Default to black if ID is not found
}
