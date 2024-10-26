import {getTextDimensions} from '../../acetti-typography/CapSizeTextNew';
import {Sequence, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';
import invariant from 'tiny-invariant';

import {getKeyFramesInterpolator} from '../../compositions/POCs/Keyframes/Keyframes/keyframes';
import {WaterfallTextEffect} from '../../acetti-typography/TextEffects/WaterfallTextEffect';
import {DisplayGridRails, HtmlArea} from '../../acetti-layout';
import {
	useMatrixLayout,
	getMatrixLayoutCellArea,
} from '../../acetti-layout/hooks/useMatrixLayout';
import {FadeInAndOutText} from '../../acetti-typography/TextEffects/FadeInAndOutText';
import {ThemeType} from '../../acetti-themes/themeTypes';
import {TypographyStyle} from '../../compositions/POCs/02-TypographicLayouts/TextStyles/TextStylesComposition';
import {getSimpleBarChartKeyframes} from './getKeyframes';

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
	labelWidth: labelWidthProp,
	valueLabelWidth: valueLabelWidthProp,
	valueDomain: valueDomainProp,
}) => {
	const {fps, durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();

	const simpleBarChartKeyframes = getSimpleBarChartKeyframes({
		fps,
		durationInFrames,
		data,
	});

	const nrColumns = 3;
	const nrRows = data.length;

	const BAR_HEIGHT = baseline * 2;

	const ROW_SPACE = baseline * 0.5;
	const COLUMN_SPACE = baseline * 0.7;

	// TODO eventually use this, to introduce zero-line
	const ROW_PADDING = baseline * 0;

	// =========================================
	const barChartHeight =
		nrRows * BAR_HEIGHT + (nrRows - 1) * ROW_SPACE + 2 * ROW_PADDING;

	// TODO use labelTextStyleProps after we use that text style!!!
	// determine labelWidth from all labelWidth's
	// ------------------------------------------
	const labelWidths = data.map(
		(it) =>
			getTextDimensions({key: 'datavizLabel', theme, baseline, text: it.label})
				.width
	);

	const labelWidth = labelWidthProp || Math.max(...labelWidths) * 1.1;

	// TODO use valueLabelTextStyleProps after we use that text style!!!
	// determine valueLabelWidth from all valueLabelWidth's
	// ------------------------------------------
	const valueLabelWidths = data.map(
		(it) =>
			getTextDimensions({
				key: 'datavizValueLabel',
				theme,
				baseline,
				text: it.valueLabel,
			}).width
	);

	const valueLabelWidth = valueLabelWidthProp || Math.max(...valueLabelWidths);

	// 1 TODO: document varying sizes matrix layout in flic!!!
	// 2 TODO API: (and better to use normal layout, not matrixlayout)
	// 3 TODO: update also column charts with all this update
	// const barChartLayout = useBarChartLayout({data,baseline});
	// barChartLayout.getLabelArea(i);
	// barChartLayout.getBarArea(i);
	// barChartLayout.getValueLabelArea(i);
	// barChartLayout.getZeroLineArea();
	// barChartLayout.getWidth();
	// barChartLayout.getHeight();

	const matrixLayout = useMatrixLayout({
		width,
		height: barChartHeight,
		nrColumns,
		nrRows,
		rowSpacePixels: ROW_SPACE,
		columnSpacePixels: COLUMN_SPACE,
		columnSizes: [
			{type: 'pixel', value: labelWidth},
			{type: 'fr', value: 1},
			{type: 'pixel', value: valueLabelWidth},
		],
		rowPaddingPixels: ROW_PADDING,
	});

	const getLabelArea = (i: number) => {
		return getMatrixLayoutCellArea({layout: matrixLayout, row: i, column: 0});
	};

	const getBarArea = (i: number) => {
		return getMatrixLayoutCellArea({layout: matrixLayout, row: i, column: 1});
	};

	const getValueLabelArea = (i: number) => {
		return getMatrixLayoutCellArea({layout: matrixLayout, row: i, column: 2});
	};

	// determine domain
	// ------------------------------------------
	const values = data.map((it) => it.value);
	const valueDomain =
		valueDomainProp || ([0, Math.max(...values)] as [number, number]);

	// the keyframes for the labels
	// -------------------------------------------------------------------
	const labelKeyframes = simpleBarChartKeyframes.keyFrames.filter((kf) =>
		kf.id.startsWith('LABEL_APPEAR__')
	);

	const barWidthScale: ScaleLinear<number, number> = scaleLinear()
		.domain(valueDomain)
		.range([0, getBarArea(0).width]);

	return (
		<div
			style={{
				position: 'relative',
				width: matrixLayout.width,
				height: matrixLayout.height,
			}}
		>
			{showLayout ? (
				<div style={{position: 'absolute', top: 0, left: 0}}>
					<DisplayGridRails {...matrixLayout} stroke="#555" />
				</div>
			) : null}

			{labelKeyframes.map((labelKeyframe, i) => {
				return (
					<Sequence from={labelKeyframe.frame} layout="none">
						<HtmlArea area={getLabelArea(i)}>
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
				const valueLabelKeyframe = simpleBarChartKeyframes.keyFrames.find(
					(kf) => kf.id === 'VALUE_LABEL_APPEAR__' + it.id
				);
				invariant(valueLabelKeyframe);

				const fullBarWidth = barWidthScale(it.value);

				const interpolateCurrentBarWidth = getKeyFramesInterpolator(
					simpleBarChartKeyframes,
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

				const barArea = getBarArea(i);

				const valueLabelMarginLeft = -1 * (barArea.width - currentBarWidth);

				return (
					<>
						{/* TODO next: */}
						{/* AND: wrap in Keyframes Sequence deciding start and end of bar animation */}
						{/* <BarWithValueLabel barArea={} valueLabelArea={} value={} valueLabel={} barColor={} labelColor={} /> */}

						{/* TODO own bar frames */}
						{/* <Sequence from={valueLabelKeyframe.frame} layout="none">
							<HtmlArea area={getBarArea(i)}>
								<div
									style={{
										height: '100%',
										width: '100%',
										backgroundColor: 'cyan',
									}}
								>
									{currentBarWidth}
								</div>
							</HtmlArea>
						</Sequence> */}

						<HtmlArea area={barArea}>
							<svg width={barArea.width} height={barArea.height}>
								<rect
									// TODO add opacity eventually
									// opacity={opacity}
									y={0}
									x={0}
									height={barArea.height}
									width={currentBarWidth}
									fill={it.barColor || 'cyan'}
									rx={3}
									ry={3}
								/>
							</svg>
						</HtmlArea>

						<Sequence from={valueLabelKeyframe.frame} layout="none">
							<HtmlArea area={getValueLabelArea(i)}>
								<div
									style={{
										display: 'flex',
										justifyContent: 'flex-start',
										alignItems: 'center',
										height: '100%',
										// TODO determine
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
		</div>
	);
};
