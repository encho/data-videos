import {TGridLayoutArea} from '../acetti-layout';
import {ThemeType} from '../acetti-themes/themeTypes';

import {TXAxisSpec} from './utils/axisSpecs_xAxis';
import {TPeriodsScale} from '../acetti-ts-periodsScale/periodsScale';

type TTheme_XAxis = ThemeType['xAxis'];

export const XAxis_SpecBased: React.FC<{
	area: TGridLayoutArea;
	axisSpec: TXAxisSpec;
	theme: TTheme_XAxis;
	periodsScale: TPeriodsScale;
	clip?: boolean;
}> = ({area, theme, axisSpec, periodsScale, clip = true}) => {
	const TICK_LINE_SIZE = 24;
	const TICK_TEXT_FONT_SIZE = 24;
	const TICK_TEXT_FONT_WEIGHT = 500;

	return (
		<svg
			width={area.width}
			height={area.height}
			style={{
				overflow: 'visible',
			}}
		>
			<defs>
				<clipPath id="xAxisAreaClipPath">
					<rect x={0} y={0} width={area.width} height={area.height} />
				</clipPath>
			</defs>

			{axisSpec.ticks.map((xTick) => {
				const value = periodsScale.mapFloatIndexToRange(xTick.periodFloatIndex);

				return (
					<g
						clipPath={clip ? 'url(#xAxisAreaClipPath)' : undefined}
						transform="translate(0,0)"
					>
						<line
							x1={value}
							x2={value}
							y1={0}
							y2={TICK_LINE_SIZE}
							stroke={theme.tickColor}
							strokeWidth={4}
						/>
					</g>
				);
			})}

			{axisSpec.labels.map((xLabel) => {
				// TODO integrate margin/padding
				const value = periodsScale.mapFloatIndexToRange(
					xLabel.periodFloatIndex
				);

				return (
					<g
						clipPath={clip ? 'url(#xAxisAreaClipPath)' : undefined}
						transform="translate(0,0)"
					>
						<text
							// textAnchor="left"
							textAnchor={xLabel.textAnchor || 'middle'}
							alignmentBaseline="baseline"
							fill={theme.color}
							fontSize={TICK_TEXT_FONT_SIZE}
							fontWeight={TICK_TEXT_FONT_WEIGHT}
							x={value}
							// y={TICK_TEXT_FONT_SIZE}
							y={TICK_LINE_SIZE + TICK_TEXT_FONT_SIZE}
						>
							{xLabel.label}
						</text>
					</g>
				);
			})}
		</svg>
	);
};
