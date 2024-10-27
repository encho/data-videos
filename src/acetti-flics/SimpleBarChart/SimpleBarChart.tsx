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
import {useBarChartLayout} from './useBarChartLayout';

export type TSimpleBarChartData = {
	label: string;
	value: number;
	barColor?: string;
	valueLabel: string;
	id: string;
}[];

type TSimpleBarChartProps = {
	theme: ThemeType;
	data: TSimpleBarChartData;
	width: number;
	baseline: number;
	labelWidth?: number;
	valueLabelWidth?: number;
	valueDomain?: [number, number];
	showLayout?: boolean;
};

export const SimpleBarChart: React.FC<TSimpleBarChartProps> = ({
	theme,
	data,
	width,
	baseline,
	showLayout = false,
	labelWidth,
	valueLabelWidth,
	valueDomain: valueDomainProp,
}) => {
	const {fps, durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();

	console.log({baseline});

	const barChartKeyframes = useBarChartKeyframes({
		fps,
		durationInFrames,
		data,
	});

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

	const zeroLineArea = barChartLayout.getZeroLineArea();

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
									radius={3}
								/>
							</svg>
						</HtmlArea>

						<Sequence from={valueLabelKeyframe.frame} layout="none">
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

			<HtmlArea area={zeroLineArea} fill="transparent">
				<div
					style={{
						height: zeroLineArea.height,
						width: baseline * 0.2,
						// backgroundColor: '#888',
						backgroundColor: '#fff',
					}}
				/>
			</HtmlArea>
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
