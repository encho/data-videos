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
// import {
// 	TDynamicListTransitionContext,
// 	useDynamicListTransition,
// } from './useDynamicListTransition';
import {DisplayGridRails} from '../../../../acetti-layout';
import {HtmlArea} from '../../../../acetti-layout';
import {
	getMatrixLayoutCellArea,
	useMatrixLayout,
} from '../../../../acetti-layout/hooks/useMatrixLayout';
import {AnimateAreas} from './AnimateAreas';
import {useListAnimation} from './useListAnimation';

export const listAnimationCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const ListAnimationComposition: React.FC<
	z.infer<typeof listAnimationCompositionSchema>
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

	const listAnimationContext = useListAnimation({
		width: area_1.width,
		height: area_1.height,
		transitions: [
			{
				itemsFrom,
				itemsTo,
				visibleIndicesFrom,
				visibleIndicesTo,
				easingFunction: Easing.elastic(2),
				durationInFrames: durationInFrames / 2,
			},
			{
				itemsFrom: itemsTo,
				itemsTo: itemsFrom,
				visibleIndicesFrom: visibleIndicesTo,
				visibleIndicesTo: visibleIndicesFrom,
				easingFunction: Easing.ease,
				durationInFrames: durationInFrames / 2,
			},
		],
	});

	const {currentTransitionContext} = listAnimationContext;

	return (
		<>
			<Page>
				<TypographyStyle
					typographyStyle={theme.typography.textStyles.h1}
					baseline={baseline}
					marginBottom={2}
				>
					List Animation Demo
				</TypographyStyle>

				<div style={{position: 'relative'}}>
					<DisplayGridRails
						{...currentTransitionContext.layoutFrom.gridLayout}
						stroke="rgba(255,0,255,1)"
					/>
					<HtmlArea area={area_1} fill="rgba(255,0,255,0.15)">
						{currentTransitionContext.itemsFrom.map((it) => {
							const area = currentTransitionContext.getListItemAreaFrom(it.id);

							const idColor = getPredefinedColor(it.id);

							const isVisible = isIdInItems(
								it.id,
								currentTransitionContext.visibleItemsFrom
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

					<HtmlArea area={area_2} fill="rgba(255,0,255,0.15)">
						<DisplayGridRails
							{...currentTransitionContext.layoutTo.gridLayout}
							stroke="rgba(255,0,255,1)"
						/>
						{currentTransitionContext.itemsTo.map((it) => {
							const area = currentTransitionContext.getListItemAreaTo(it.id);
							const idColor = getPredefinedColor(it.id);

							const isVisible = isIdInItems(
								it.id,
								currentTransitionContext.visibleItemsTo
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

					<HtmlArea area={area_3} fill="rgba(255,0,255,0.15)">
						<AnimateAreas context={currentTransitionContext} />
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
							<Row>CURRENT TRANSITION CONTEXT</Row>
							<Row>
								<div>(relative) frame</div>
								<Value>
									{listAnimationContext.currentTransitionContext.frame}
								</Value>
							</Row>

							<Row>
								<div>transitions</div>

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
	{id: 'Id-001'},
	{id: 'Id-002'},
	{id: 'Id-003'},
	{id: 'Id-004'},
	{id: 'Id-011'},
	{id: 'Id-005'},
	{id: 'Id-006'},
	{id: 'Id-007'},
	{id: 'Id-010'},
];

const itemsTo = [
	{id: 'Id-009'},
	{id: 'Id-003'},
	{id: 'Id-007'},
	{id: 'Id-002'},
	{id: 'Id-005'},
	{id: 'Id-001'},
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
