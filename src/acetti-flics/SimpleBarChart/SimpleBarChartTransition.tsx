import {useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {useCallback} from 'react';
import invariant from 'tiny-invariant';
import {isNumber} from 'lodash';

import {DisplayGridRails, HtmlArea} from '../../acetti-layout';
import {ThemeType} from '../../acetti-themes/themeTypes';
import {useStillBarChartLayout} from './useStillBarChartLayout';
import {getBarChartBaseline} from './useBarChartLayout';
import {useElementDimensions} from '../../compositions/POCs/03-Page/SimplePage/useElementDimensions';
import {mixBarChartLayout} from './useAnimatedBarChartLayout';
import {TBaselineOrHeight} from './SimpleBarChart';
import {MeasureLabels, MeasureValueLabels} from './SimpleBarChart';
import {
	DefaultLabelComponent,
	DefaultValueLabelComponent,
} from './SimpleBarChart';
import {
	TBarChartLabelComponent,
	TBarChartValueLabelComponent,
} from './SimpleBarChart';

export type TSimpleBarChartData = {
	label: string;
	value: number;
	barColor?: string;
	valueLabel: string;
	id: string;
}[];

type TSimpleBarChartTransitionProps = TBaselineOrHeight & {
	theme: ThemeType;
	dataFrom: TSimpleBarChartData;
	dataTo: TSimpleBarChartData;
	width: number;
	labelWidth?: number;
	valueLabelWidth?: number;
	negativeValueLabelWidth?: number;
	showLayout?: boolean;
	valueDomainFrom: [number, number];
	valueDomainTo: [number, number];
	hideLabels?: boolean;
	CustomLabelComponent?: TBarChartLabelComponent;
	CustomValueLabelComponent?: TBarChartValueLabelComponent;
};

export const SimpleBarChartTransition: React.FC<
	TSimpleBarChartTransitionProps
> = ({
	theme,
	dataTo,
	dataFrom,
	width,
	height,
	baseline: baselineProp,
	// showLayout = false, // TODO implement functionality
	hideLabels = false,
	labelWidth: labelWidthProp,
	valueLabelWidth: valueLabelWidthProp,
	negativeValueLabelWidth: negativeValueLabelWidthProp,
	valueDomainFrom,
	valueDomainTo,
	CustomLabelComponent,
	CustomValueLabelComponent,
}) => {
	const {ref: labelsRef, dimensions: labelsDimensions} =
		useElementDimensions(true);
	const {ref: valueLabelsRef, dimensions: valueLabelsDimensions} =
		useElementDimensions(true);
	const {
		ref: negativeValueLabelsRef,
		dimensions: negativeValueLabelsDimensions,
	} = useElementDimensions(true);

	// if height is passed, the baseline is computed for that height, otherwise the baseline prop is used
	const baseline = height ? getBarChartBaseline(height, dataTo) : baselineProp;
	invariant(baseline);

	const LabelComponent = CustomLabelComponent || DefaultLabelComponent;

	const ValueLabelComponent =
		CustomValueLabelComponent || DefaultValueLabelComponent;

	// TODO get the corresponding component and it's parametrization from theme
	const MeasureLabelComponent = useCallback(
		({id, children}: {children: string; id: string}) => {
			return (
				<LabelComponent
					id={id}
					baseline={baseline}
					theme={theme}
					animateEnter={false}
					animateExit={false}
				>
					{children}
				</LabelComponent>
			);
		},
		[baseline, theme, LabelComponent]
	);

	// TODO get the corresponding component and it's parametrization from theme
	const MeasureValueLabelComponent = useCallback(
		// eslint-disable-next-line
		({id, children}: {children: string; id: string}) => {
			return (
				<ValueLabelComponent
					id={id}
					baseline={baseline}
					theme={theme}
					animateEnter={false}
					animateExit={false}
				>
					{children}
				</ValueLabelComponent>
			);
		},
		[baseline, ValueLabelComponent, theme]
	);

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
				data={[...dataTo, ...dataFrom]}
				theme={theme}
				baseline={baseline}
				Component={MeasureLabelComponent}
			/>
			{/* measure positive value labels */}
			<MeasureValueLabels
				key="valueLabelMeasurement"
				ref={valueLabelsRef}
				data={[...dataTo, ...dataFrom].filter((it) => it.value >= 0)}
				theme={theme}
				baseline={baseline}
				Component={MeasureValueLabelComponent}
			/>
			{/* measure negative value labels */}
			<MeasureValueLabels
				key="negativeValueLabelMeasurement"
				ref={negativeValueLabelsRef}
				data={[...dataTo, ...dataFrom].filter((it) => it.value < 0)}
				theme={theme}
				baseline={baseline}
				Component={MeasureValueLabelComponent}
			/>

			{isNumber(labelWidth) &&
			isNumber(valueLabelWidth) &&
			isNumber(negativeValueLabelWidth) ? (
				<SimpleBarChartTransitionWithMeasurements
					theme={theme}
					hideLabels={hideLabels}
					baseline={baseline}
					LabelComponent={LabelComponent}
					ValueLabelComponent={ValueLabelComponent}
					valueLabelWidth={valueLabelWidth}
					negativeValueLabelWidth={negativeValueLabelWidth}
					labelWidth={labelWidth}
					dataFrom={dataFrom}
					dataTo={dataTo}
					width={width}
					valueDomainFrom={valueDomainFrom}
					valueDomainTo={valueDomainTo}
				/>
			) : null}
		</>
	);
};

export const SimpleBarChartTransitionWithMeasurements: React.FC<{
	theme: ThemeType;
	baseline: number;
	hideLabels?: boolean;
	valueLabelWidth: number;
	labelWidth: number;
	negativeValueLabelWidth: number;
	dataFrom: TSimpleBarChartData;
	dataTo: TSimpleBarChartData;
	width: number;
	valueDomainFrom: [number, number];
	valueDomainTo: [number, number];
	LabelComponent: TBarChartLabelComponent;
	ValueLabelComponent: TBarChartValueLabelComponent;
}> = ({
	theme,
	baseline,
	LabelComponent,
	ValueLabelComponent,
	hideLabels = false,
	valueLabelWidth,
	negativeValueLabelWidth,
	labelWidth,
	dataFrom,
	dataTo,
	width,
	valueDomainFrom,
	valueDomainTo,
}) => {
	const {durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();

	const animationProgress = (frame + 1) / durationInFrames;
	const mixPercentage = interpolate(animationProgress, [0, 1], [1, 0], {
		easing: Easing.ease,
	});

	const barChartLayout_from = useStillBarChartLayout({
		baseline,
		theme,
		data: dataFrom,
		width,
		labelWidth,
		valueLabelWidth,
		negativeValueLabelWidth,
		valueDomain: valueDomainFrom,
		hideLabels,
	});

	const barChartLayout_to = useStillBarChartLayout({
		baseline,
		theme,
		data: dataTo,
		width,
		labelWidth,
		valueLabelWidth,
		negativeValueLabelWidth,
		valueDomain: valueDomainTo,
		hideLabels,
	});

	const barChartLayout = mixBarChartLayout(
		barChartLayout_from,
		barChartLayout_to,
		mixPercentage
	);

	invariant(
		areIdsEqual(dataFrom, dataTo),
		"dataFrom and dataTo id's should be equal"
	);

	const zeroLineArea = barChartLayout.getZeroLineArea();

	return (
		<div
			style={{
				position: 'relative',
				width: barChartLayout.width,
				height: barChartLayout.height,
			}}
		>
			{/* {false ? (
				<div style={{position: 'absolute', top: 0, left: 0}}>
					<DisplayGridRails {...barChartLayout.gridLayout} stroke="#555" />
				</div>
			) : null} */}

			{dataTo.map((it, i) => {
				const barArea = barChartLayout.getBarArea(it.id);
				const labelArea = barChartLayout.getLabelArea(it.id);
				const valueLabelArea = barChartLayout.getValueLabelArea(it.id);

				// TODO better colors
				return (
					<>
						{hideLabels ? null : (
							<HtmlArea area={labelArea}>
								<div
									style={{
										display: 'flex',
										justifyContent: 'flex-end',
										alignItems: 'center',
										height: '100%',
										// QUICK-FIX: would not be neeed actually, why is text wrapping in some cases??
										textWrap: 'nowrap',
									}}
								>
									<LabelComponent
										id={dataTo[i].id}
										animateEnter={false}
										animateExit={false}
										baseline={baseline}
										theme={theme}
									>
										{dataTo[i].label}
									</LabelComponent>
								</div>
							</HtmlArea>
						)}
						<HtmlArea area={barArea}>
							<svg width={barArea.width} height={barArea.height}>
								{it.value > 0 && barArea.width ? (
									<RoundedRightRect
										y={0}
										x={0}
										height={barArea.height}
										width={barArea.width}
										fill={it.barColor || 'magenta'}
										// TODO: get radius from baseline?
										radius={5}
									/>
								) : it.value < 0 && barArea.width ? (
									<RoundedLeftRect
										y={0}
										x={0}
										height={barArea.height}
										width={barArea.width}
										fill={it.barColor || 'magenta'}
										// TODO: get radius from baseline?
										radius={5}
									/>
								) : null}
							</svg>
						</HtmlArea>

						<HtmlArea area={valueLabelArea}>
							<div
								style={{
									display: 'flex',
									justifyContent: it.value >= 0 ? 'flex-start' : 'flex-end',
									alignItems: 'center',
									height: '100%',
									// QUICK-FIX: would not be neeed actually, why is text wrapping in some cases??
									textWrap: 'nowrap',
								}}
							>
								<ValueLabelComponent
									id={dataTo[i].id}
									animateEnter={false}
									animateExit={false}
									baseline={baseline}
									theme={theme}
								>
									{dataTo[i].valueLabel}
								</ValueLabelComponent>
							</div>
						</HtmlArea>
					</>
				);
			})}

			<HtmlArea area={zeroLineArea} fill="transparent">
				<svg
					width={zeroLineArea.width}
					height={zeroLineArea.height}
					style={{overflow: 'visible'}}
				>
					<line
						x1={barChartLayout.zeroLineX - zeroLineArea.x1}
						x2={barChartLayout.zeroLineX - zeroLineArea.x1}
						y1={0}
						y2={zeroLineArea.height}
						stroke={theme.yAxis.color}
						strokeWidth={baseline * 0.2}
					/>
				</svg>
			</HtmlArea>
		</div>
	);
};

interface IdObject {
	id: string;
}

function areIdsEqual(arr1: IdObject[], arr2: IdObject[]): boolean {
	// Check if the lengths of the arrays are the same
	if (arr1.length !== arr2.length) {
		return false; // If lengths are different, ids cannot be equal
	}

	// Sort both arrays by id to ensure order does not affect comparison
	const sortedArr1 = arr1.slice().sort((a, b) => a.id.localeCompare(b.id));
	const sortedArr2 = arr2.slice().sort((a, b) => a.id.localeCompare(b.id));

	// Compare the ids in both sorted arrays
	for (let i = 0; i < sortedArr1.length; i++) {
		if (sortedArr1[i].id !== sortedArr2[i].id) {
			return false; // If any id does not match, return false
		}
	}

	return true; // All ids match
}
// Example usage:
// const array1 = [{ id: '1' }, { id: '2' }, { id: '3' }];
// const array2 = [{ id: '3' }, { id: '1' }, { id: '2' }];
// const array3 = [{ id: '1' }, { id: '2' }];

// console.log(areIdsEqual(array1, array2)); // true
// console.log(areIdsEqual(array1, array3)); // false

// TODO use only one
interface RoundedRectProps {
	x: number; // X-coordinate of the rectangle's top-left corner
	y: number; // Y-coordinate of the rectangle's top-left corner
	width: number;
	height: number;
	radius: number;
	fill?: string;
	stroke?: string;
	strokeWidth?: number;
}

const RoundedRightRect: React.FC<RoundedRectProps> = ({
	x,
	y,
	width,
	height,
	radius,
	fill = 'blue',
	stroke = 'transparent',
	strokeWidth = 0,
}) => {
	// Ensure the radius does not exceed half the height
	const r = Math.min(radius, height / 2);

	// Define the path for a rectangle with only the right corners rounded
	const path = `
    M ${x} ${y}
    H ${x + width - r}
    A ${r} ${r} 0 0 1 ${x + width} ${y + r}
    V ${y + height - r}
    A ${r} ${r} 0 0 1 ${x + width - r} ${y + height}
    H ${x}
    V ${y}
    Z
  `;

	return (
		<svg>
			<path d={path} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
		</svg>
	);
};

// TODO use only one
const RoundedLeftRect: React.FC<RoundedRectProps> = ({
	x,
	y,
	width,
	height,
	radius,
	fill = 'blue',
	stroke = 'transparent',
	strokeWidth = 0,
}) => {
	// Ensure the radius does not exceed half the height
	const r = Math.min(radius, height / 2);

	// Define the path for a rectangle with only the left corners rounded
	const path = `
    M ${x + r} ${y}
    H ${x + width}
    V ${y + height}
    H ${x + r}
    A ${r} ${r} 0 0 1 ${x} ${y + height - r}
    V ${y + r}
    A ${r} ${r} 0 0 1 ${x + r} ${y}
    Z
  `;

	// Calculate SVG canvas size to accommodate the rectangle and stroke
	const svgWidth = x + width + strokeWidth;
	const svgHeight = y + height + strokeWidth;

	return (
		<svg width={svgWidth} height={svgHeight} xmlns="http://www.w3.org/2000/svg">
			<path d={path} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
		</svg>
	);
};
