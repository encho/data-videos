import {Sequence, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';
import invariant from 'tiny-invariant';

import {getKeyFramesInterpolator} from '../../compositions/POCs/Keyframes/Keyframes/keyframes';
import {WaterfallTextEffect} from '../../acetti-typography/TextEffects/WaterfallTextEffect';
import {DisplayGridRails, HtmlArea} from '../../acetti-layout';
import {FadeInAndOutText} from '../../acetti-typography/TextEffects/FadeInAndOutText';
import {ThemeType} from '../../acetti-themes/themeTypes';
import {TypographyStyle} from '../../compositions/POCs/02-TypographicLayouts/TextStyles/TextStylesComposition';
import {useBarChartKeyframes} from './useBarChartKeyframes';
import {getBarChartBaseline, useBarChartLayout} from './useBarChartLayout';

export type TSimpleBarChartData = {
	label: string;
	value: number;
	barColor?: string;
	valueLabel: string;
	id: string;
}[];

interface HeightProp {
	height: number;
	baseline?: never; // Ensures baseline cannot be provided when height is present
}

interface BaselineProp {
	baseline: number;
	height?: never; // Ensures height cannot be provided when baseline is present
}

type TBaselineOrHeight = HeightProp | BaselineProp;

type TSimpleBarChartProps = TBaselineOrHeight & {
	theme: ThemeType;
	data: TSimpleBarChartData;
	width: number;
	// height?: number;
	// baseline?: number;
	labelWidth?: number;
	valueLabelWidth?: number;
	valueDomain?: [number, number];
	showLayout?: boolean;
};

export const SimpleBarChart: React.FC<TSimpleBarChartProps> = ({
	theme,
	data,
	width,
	height,
	baseline: baseLineProp,
	showLayout = false,
	labelWidth,
	valueLabelWidth,
	valueDomain: valueDomainProp,
}) => {
	const {fps, durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();

	const barChartKeyframes = useBarChartKeyframes({
		fps,
		durationInFrames,
		data,
	});

	// if height is passed, the baseline is computed for that height, otherwise the baseline prop is used
	const baseline = height ? getBarChartBaseline(height, data) : baseLineProp;
	invariant(baseline);

	const barChartLayout = useBarChartLayout({
		baseline,
		theme,
		data,
		width,
		labelWidth,
		valueLabelWidth,
	});

	// determine domain
	// ------------------------------------------
	const values = data.map((it) => it.value);
	const valueDomain =
		valueDomainProp || ([0, Math.max(...values)] as [number, number]);

	// the keyframes for the labels
	// -------------------------------------------------------------------
	const labelKeyframes = barChartKeyframes.keyFrames.filter((kf) =>
		kf.id.startsWith('LABEL_APPEAR__')
	);

	const barWidthScale: ScaleLinear<number, number> = scaleLinear()
		.domain(valueDomain)
		.range([0, barChartLayout.getBarArea(0).width]);

	return (
		<div
			style={{
				position: 'relative',
				width: barChartLayout.width,
				height: barChartLayout.height,
			}}
		>
			{showLayout ? (
				<div style={{position: 'absolute', top: 0, left: 0}}>
					<DisplayGridRails {...barChartLayout.gridLayout} stroke="#555" />
				</div>
			) : null}

			{labelKeyframes.map((labelKeyframe, i) => {
				return (
					<Sequence from={labelKeyframe.frame} layout="none">
						<HtmlArea area={barChartLayout.getLabelArea(i)}>
							<div
								style={{
									display: 'flex',
									justifyContent: 'flex-end',
									alignItems: 'center',
									height: '100%',
								}}
							>
								<TypographyStyle
									typographyStyle={theme.typography.textStyles.datavizLabel}
									baseline={baseline}
								>
									<WaterfallTextEffect>{data[i].label}</WaterfallTextEffect>
								</TypographyStyle>
							</div>
						</HtmlArea>
					</Sequence>
				);
			})}

			{/* TODO actually bring the label keyframes also in here, s.t. it is all together */}
			{data.map((it, i) => {
				const valueLabelKeyframe = barChartKeyframes.keyFrames.find(
					(kf) => kf.id === 'VALUE_LABEL_APPEAR__' + it.id
				);
				invariant(valueLabelKeyframe);
				const valueLabelDissappearKeyframe = barChartKeyframes.keyFrames.find(
					(kf) => kf.id === 'VALUE_LABEL_DISSAPPEAR__' + it.id
				);
				invariant(valueLabelDissappearKeyframe);

				const fullBarWidth = barWidthScale(it.value);

				const interpolateCurrentBarWidth = getKeyFramesInterpolator(
					barChartKeyframes,
					[
						`BAR_ENTER_START__${it.id}`,
						`BAR_ENTER_END__${it.id}`,
						`BAR_EXIT_START__${it.id}`,
						`BAR_EXIT_END__${it.id}`,
					],
					[0, fullBarWidth, fullBarWidth, 0],
					[Easing.ease, Easing.ease, Easing.ease]
				);

				const currentBarWidth = interpolateCurrentBarWidth(frame);
				const barArea = barChartLayout.getBarArea(i);

				const valueLabelMarginLeft = -1 * (barArea.width - currentBarWidth);

				return (
					<>
						<HtmlArea area={barArea}>
							<svg width={barArea.width} height={barArea.height}>
								{/* <rect
									// TODO add opacity eventually
									// opacity={opacity}
									y={0}
									x={0}
									height={barArea.height}
									width={currentBarWidth}
									fill={it.barColor || 'cyan'}
									rx={3}
									ry={3}
								/> */}
								<RoundedRightRect
									y={0}
									x={0}
									height={barArea.height}
									width={currentBarWidth}
									fill={it.barColor || 'cyan'}
									// TODO: get radius from baseline?
									radius={5}
								/>
							</svg>
						</HtmlArea>

						{/* TODO use KeyframeSequence component */}
						<Sequence
							from={valueLabelKeyframe.frame}
							durationInFrames={
								valueLabelDissappearKeyframe.frame - valueLabelKeyframe.frame
							}
							layout="none"
						>
							<HtmlArea area={barChartLayout.getValueLabelArea(i)}>
								<div
									style={{
										display: 'flex',
										justifyContent: 'flex-start',
										alignItems: 'center',
										height: '100%',
										marginLeft: valueLabelMarginLeft,
									}}
								>
									<TypographyStyle
										typographyStyle={
											theme.typography.textStyles.datavizValueLabel
										}
										baseline={baseline}
									>
										<FadeInAndOutText>{data[i].valueLabel}</FadeInAndOutText>
									</TypographyStyle>
								</div>
							</HtmlArea>
						</Sequence>
					</>
				);
			})}

			{(() => {
				const zeroLineArea = barChartLayout.getZeroLineArea();

				// TODO eventually useCallback at start of the component to have more efficiency
				const interpolateZeroLine__y1 = getKeyFramesInterpolator(
					barChartKeyframes,
					[
						'ZEROLINE_ENTER_START',
						'ZEROLINE_ENTER_END',
						'ZEROLINE_EXIT_START',
						'ZEROLINE_EXIT_END',
					],
					[0, 0, 0, zeroLineArea.height],
					[Easing.ease, Easing.ease, Easing.ease]
				);

				// TODO eventually useCallback at start of the component to have more efficiency
				const interpolateZeroLine__y2 = getKeyFramesInterpolator(
					barChartKeyframes,
					[
						'ZEROLINE_ENTER_START',
						'ZEROLINE_ENTER_END',
						'ZEROLINE_EXIT_START',
						'ZEROLINE_EXIT_END',
					],
					[0, zeroLineArea.height, zeroLineArea.height, zeroLineArea.height],
					[Easing.ease, Easing.ease, Easing.ease]
				);

				// TODO eventually useCallback at start of the component to have more efficiency
				const interpolateZeroLine__opacity = getKeyFramesInterpolator(
					barChartKeyframes,
					[
						'ZEROLINE_ENTER_START',
						'ZEROLINE_ENTER_END',
						'ZEROLINE_EXIT_START',
						'ZEROLINE_EXIT_END',
					],
					[0, 1, 1, 0],
					[Easing.ease, Easing.ease, Easing.ease]
				);

				const y1 = interpolateZeroLine__y1(frame);
				const y2 = interpolateZeroLine__y2(frame);
				const opacity = interpolateZeroLine__opacity(frame);

				return (
					<HtmlArea area={zeroLineArea} fill="transparent">
						<svg
							width={zeroLineArea.width}
							height={zeroLineArea.height}
							style={{overflow: 'visible'}}
						>
							<line
								x1={0}
								x2={0}
								y1={y1}
								y2={y2}
								stroke="#666"
								strokeWidth={baseline * 0.2}
								opacity={opacity}
							/>
						</svg>
					</HtmlArea>
				);
			})()}
		</div>
	);
};

interface RoundedRightRectProps {
	x: number; // X-coordinate of the rectangle's top-left corner
	y: number; // Y-coordinate of the rectangle's top-left corner
	width: number;
	height: number;
	radius: number;
	fill?: string;
	stroke?: string;
	strokeWidth?: number;
}

const RoundedRightRect: React.FC<RoundedRightRectProps> = ({
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
