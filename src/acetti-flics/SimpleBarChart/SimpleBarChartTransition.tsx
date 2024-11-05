import {useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {useCallback, ComponentType} from 'react';
import invariant from 'tiny-invariant';

import {DisplayGridRails, HtmlArea} from '../../acetti-layout';
import {ThemeType} from '../../acetti-themes/themeTypes';
// import {useBarChartLayout} from './useBarChartLayout';
import {useStillBarChartLayout} from './useStillBarChartLayout';
import {getBarChartBaseline} from './useBarChartLayout';
import {useElementDimensions} from '../../compositions/POCs/03-Page/SimplePage/useElementDimensions';
import {
	mixBarChartLayout,
	// useAnimatedBarChartLayout,
} from './useAnimatedBarChartLayout';
import {TypographyStyle} from '../../compositions/POCs/02-TypographicLayouts/TextStyles/TextStylesComposition';
// import {TextAnimationSubtle} from '../../compositions/POCs/01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';
import {TBarChartLayout} from './useBarChartLayout';
import {TBaselineOrHeight} from './SimpleBarChart';
import {MeasureLabels, MeasureValueLabels} from './SimpleBarChart';
// import {interpolate} from 'chroma-js';

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
	CustomLabelComponent?: ComponentType<{children: string; id: string}>;
	CustomValueLabelComponent?: ComponentType<{
		children: string;
		id: string;
	}>;
	valueDomainFrom: [number, number];
	valueDomainTo: [number, number];
	hideLabels?: boolean;
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
	showLayout = false,
	hideLabels = false,
	labelWidth: labelWidthProp,
	valueLabelWidth: valueLabelWidthProp,
	negativeValueLabelWidth: negativeValueLabelWidthProp,
	valueDomainFrom,
	valueDomainTo,
	CustomLabelComponent,
	CustomValueLabelComponent,
	// TODO add the below to be compatible!!!
	// ***************************************
	// negativeValueLabelWidth?: number;
	// showLayout?: boolean;
	// hideLabels?: boolean;
	// keyframes?: TKeyFramesGroup;
	// //
}) => {
	// @ts-ignore: have to have this otherwise we have "a bug in react" error message
	const {fps, durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();
	const animationProgress = (frame + 1) / durationInFrames;
	const mixPercentage = interpolate(animationProgress, [0, 1], [1, 0], {
		easing: Easing.ease,
	});

	// const {ref: labelsRef, dimensions: labelsDimensions} =
	// 	useElementDimensions(true);
	// const {ref: valueLabelsRef, dimensions: valueLabelsDimensions} =
	// 	useElementDimensions(true);
	// const {
	// 	ref: negativeValueLabelsRef,
	// 	dimensions: negativeValueLabelsDimensions,
	// } = useElementDimensions(true);

	// const labelWidth = labelWidthProp || labelsDimensions?.width || 0;
	// const valueLabelWidth =
	// 	valueLabelWidthProp || valueLabelsDimensions?.width || 0;
	// const negativeValueLabelWidth =
	// 	negativeValueLabelWidthProp || negativeValueLabelsDimensions?.width || 0;

	const labelWidth = labelWidthProp;
	const valueLabelWidth = valueLabelWidthProp;
	const negativeValueLabelWidth = negativeValueLabelWidthProp;

	// if height is passed, the baseline is computed for that height, otherwise the baseline prop is used
	const baseline = height ? getBarChartBaseline(height, dataTo) : baselineProp;
	invariant(baseline);

	// TODO check same data length and same id's
	// invariant(fromData.length === toData.length)

	const barChartLayout1 = useStillBarChartLayout({
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

	const barChartLayout2 = useStillBarChartLayout({
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
		barChartLayout1,
		barChartLayout2,
		mixPercentage
	);

	// const zeroLineArea = barChartLayout.getZeroLineArea();

	// TODO get the corresponding component and it's parametrization from theme
	const DefaultBarChartLabelComponent = useCallback(
		({children}: {children: string}) => {
			return (
				<TypographyStyle
					typographyStyle={theme.typography.textStyles.datavizLabel}
					baseline={baseline}
				>
					{/* <TextAnimationSubtle
					................
					TODO !!!!!
					enter={false}
					exit={false}
					................
						innerDelayInSeconds={0}
						translateY={baseline * 1.15}
					> */}
					{children}
					{/* </TextAnimationSubtle> */}
				</TypographyStyle>
			);
		},
		[theme, baseline] // Dependencies
	);

	const BarChartLabel = CustomLabelComponent || DefaultBarChartLabelComponent;

	// TODO get the corresponding component and it's parametrization from theme
	// e.g. api: const BarChartValueLabel = useBarChartValueLabelComponent({theme});
	const DefaultBarChartValueLabelComponent = useCallback(
		({children}: {children: string}) => {
			return (
				<TypographyStyle
					typographyStyle={theme.typography.textStyles.datavizValueLabel}
					baseline={baseline}
				>
					{/* <TextAnimationSubtle
					................
					TODO !!!!!
					enter={false}
					exit={false}
					................
						innerDelayInSeconds={0}
						translateY={baseline * 1.15}
					> */}
					{children}
					{/* </TextAnimationSubtle> */}
				</TypographyStyle>
			);
		},
		[theme, baseline] // Dependencies
	);

	const BarChartValueLabel =
		CustomValueLabelComponent || DefaultBarChartValueLabelComponent;

	return (
		<SimpleBarChartStillFromDataAndLayout
			theme={theme}
			data={dataFrom} // TODO how to transition the labels????
			barChartLayout={barChartLayout}
			hideLabels={hideLabels}
			baseline={baseline}
			CustomLabelComponent={BarChartLabel}
			CustomValueLabelComponent={BarChartValueLabel}
		/>
	);

	// return (
	// 	<>
	// 		{/* measure labels */}
	// 		<MeasureLabels
	// 			key="labelMeasurement"
	// 			ref={labelsRef}
	// 			data={[...dataTo, ...dataFrom]}
	// 			theme={theme}
	// 			baseline={baseline}
	// 			Component={BarChartLabel}
	// 		/>
	// 		{/* measure positive value labels */}
	// 		<MeasureValueLabels
	// 			key="valueLabelMeasurement"
	// 			ref={valueLabelsRef}
	// 			data={[...dataTo, ...dataFrom].filter((it) => it.value >= 0)}
	// 			theme={theme}
	// 			baseline={baseline}
	// 			Component={BarChartValueLabel}
	// 		/>
	// 		{/* measure negative value labels */}
	// 		<MeasureValueLabels
	// 			key="negativeValueLabelMeasurement"
	// 			ref={negativeValueLabelsRef}
	// 			data={[...dataTo, ...dataFrom].filter((it) => it.value < 0)}
	// 			theme={theme}
	// 			baseline={baseline}
	// 			Component={BarChartValueLabel}
	// 		/>

	// 		{labelsDimensions &&
	// 		valueLabelsDimensions &&
	// 		negativeValueLabelsDimensions ? (
	// 			<SimpleBarChartStillFromDataAndLayout
	// 				theme={theme}
	// 				data={dataFrom} // TODO how to transition the labels????
	// 				barChartLayout={barChartLayout}
	// 				hideLabels={hideLabels}
	// 				baseline={baseline}
	// 				CustomLabelComponent={BarChartLabel}
	// 				CustomValueLabelComponent={BarChartValueLabel}
	// 			/>
	// 		) : null}
	// 	</>
	// );
};

export const SimpleBarChartStillFromDataAndLayout: React.FC<{
	theme: ThemeType;
	data: TSimpleBarChartData;
	barChartLayout: TBarChartLayout & {zeroLineX: number};
	baseline: number;
	CustomLabelComponent?: ComponentType<{children: string; id: string}>;
	CustomValueLabelComponent?: ComponentType<{
		children: string;
		id: string;
	}>;
	hideLabels?: boolean;
}> = ({
	theme,
	data,
	barChartLayout,
	baseline,
	CustomLabelComponent,
	CustomValueLabelComponent,
	hideLabels = false,
}) => {
	// @ts-ignore: have to have this otherwise we have "a bug in react" error message
	// const {fps, durationInFrames} = useVideoConfig();

	const zeroLineArea = barChartLayout.getZeroLineArea();

	// TODO get the corresponding component and it's parametrization from theme
	const DefaultBarChartLabelComponent = useCallback(
		({children}: {children: string}) => {
			return (
				<TypographyStyle
					typographyStyle={theme.typography.textStyles.datavizLabel}
					baseline={baseline}
				>
					{/* <TextAnimationSubtle
					................
					TODO !!!!!
					enter={false}
					exit={false}
					................
						innerDelayInSeconds={0}
						translateY={baseline * 1.15}
					> */}
					{children}
					{/* </TextAnimationSubtle> */}
				</TypographyStyle>
			);
		},
		[theme, baseline] // Dependencies
	);

	const BarChartLabel = CustomLabelComponent || DefaultBarChartLabelComponent;

	// TODO get the corresponding component and it's parametrization from theme
	// e.g. api: const BarChartValueLabel = useBarChartValueLabelComponent({theme});
	const DefaultBarChartValueLabelComponent = useCallback(
		({children}: {children: string}) => {
			return (
				<TypographyStyle
					typographyStyle={theme.typography.textStyles.datavizValueLabel}
					baseline={baseline}
				>
					{/* <TextAnimationSubtle
					................
					TODO !!!!!
					enter={false}
					exit={false}
					................
						innerDelayInSeconds={0}
						translateY={baseline * 1.15}
					> */}
					{children}
					{/* </TextAnimationSubtle> */}
				</TypographyStyle>
			);
		},
		[theme, baseline] // Dependencies
	);

	const BarChartValueLabel =
		CustomValueLabelComponent || DefaultBarChartValueLabelComponent;

	return (
		<div
			style={{
				position: 'relative',
				width: barChartLayout.width,
				height: barChartLayout.height,
			}}
		>
			{false ? (
				<div style={{position: 'absolute', top: 0, left: 0}}>
					<DisplayGridRails {...barChartLayout.gridLayout} stroke="#555" />
				</div>
			) : null}

			{data.map((it, i) => {
				const barArea = barChartLayout.getBarArea(it.id);
				const labelArea = barChartLayout.getLabelArea(it.id);
				const valueLabelArea = barChartLayout.getValueLabelArea(it.id);

				// TODO better colors
				return (
					<>
						{!hideLabels ? (
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
									<BarChartLabel id={data[i].id}>{data[i].label}</BarChartLabel>
								</div>
							</HtmlArea>
						) : null}
						<HtmlArea
							area={barArea}
							// fill="#fff" opacity={0.5}
						>
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

						<HtmlArea
							area={valueLabelArea}
							// fill="#fff" opacity={0.5}
							// fill="rgba(255,255,255,0.2)"
						>
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
								<BarChartValueLabel id={data[i].id}>
									{data[i].valueLabel}
								</BarChartValueLabel>
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
						// opacity={opacity}
					/>
				</svg>
			</HtmlArea>
		</div>
	);
};

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
