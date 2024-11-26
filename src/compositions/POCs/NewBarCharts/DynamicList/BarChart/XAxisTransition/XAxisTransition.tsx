import React from 'react';
import invariant from 'tiny-invariant';
import {ScaleLinear} from 'd3-scale';

import {Animated_XAxis_Enter} from './Animated_XAxis_Enter/Animated_XAxis_Enter';
import {Animated_XAxis_Exit} from './Animated_XAxis_Exit/Animated_XAxis_Exit';
// import {getEnterUpdateExits} from '../../../../../../acetti-ts-utils/utils';
import {TGridLayoutArea} from '../../../../../../acetti-layout';
import {
	ListTransitionContext_Update,
	ListTransitionContext_Enter,
	ListTransitionContext_Exit,
} from '../../useListTransition/useListTransition';
import {
	TBarChartTransitionContext,
	BarChartTransitionContext_Enter,
	BarChartTransitionContext_Update,
	BarChartTransitionContext_Exit,
} from '../../useBarChartTransition';
import {HtmlArea} from '../../../../../../acetti-layout';
import {TBarChartItem} from '../../useBarChartTransition';
import {TKeyFramesGroup} from '../../../../Keyframes/Keyframes/keyframes';
import {ThemeType} from '../../../../../../acetti-themes/themeTypes';

type TXAxisTransitionCommonProps = {
	theme: ThemeType;
	baseline: number;
	area: TGridLayoutArea;
};

type TXAxisTransitionUpdateProps = TXAxisTransitionCommonProps & {
	listTransitionContext: ListTransitionContext_Update<TBarChartItem>;
	barChartTransitionContext: BarChartTransitionContext_Update;
};

type TXAxisTransitionEnterProps = TXAxisTransitionCommonProps & {
	listTransitionContext: ListTransitionContext_Enter<TBarChartItem>;
	barChartTransitionContext: BarChartTransitionContext_Enter;
	keyframes?: TKeyFramesGroup;
};

type TXAxisTransitionExitProps = TXAxisTransitionCommonProps & {
	barChartTransitionContext: BarChartTransitionContext_Exit;
	listTransitionContext: ListTransitionContext_Exit<TBarChartItem>;
	keyframes?: TKeyFramesGroup;
};

type TXAxisTransitionProps = {
	barChartTransitionContext: TBarChartTransitionContext;
	listTransitionContext:
		| ListTransitionContext_Enter<TBarChartItem>
		| ListTransitionContext_Update<TBarChartItem>
		| ListTransitionContext_Exit<TBarChartItem>;
	theme: ThemeType;
	baseline: number;
	area: TGridLayoutArea;
};

export const XAxisTransition: React.FC<TXAxisTransitionProps> = ({
	listTransitionContext,
	barChartTransitionContext,
	theme,
	baseline,
	area,
}) => {
	if (
		listTransitionContext.transitionType === 'enter' &&
		barChartTransitionContext.transitionType === 'enter'
	) {
		return (
			<XAxisTransitionEnter
				listTransitionContext={listTransitionContext}
				barChartTransitionContext={barChartTransitionContext}
				theme={theme}
				baseline={baseline}
				area={area}
			/>
		);
	}

	if (
		listTransitionContext.transitionType === 'update' &&
		barChartTransitionContext.transitionType === 'update'
	) {
		return (
			<XAxisTransitionUpdate
				listTransitionContext={listTransitionContext}
				barChartTransitionContext={barChartTransitionContext}
				theme={theme}
				baseline={baseline}
				area={area}
			/>
		);
	}

	invariant(listTransitionContext.transitionType === 'exit');
	invariant(barChartTransitionContext.transitionType === 'exit');

	return (
		<XAxisTransitionExit
			listTransitionContext={listTransitionContext}
			barChartTransitionContext={barChartTransitionContext}
			theme={theme}
			baseline={baseline}
			area={area}
		/>
	);
};

const XAxisTransitionUpdate: React.FC<TXAxisTransitionUpdateProps> = ({
	listTransitionContext,
	barChartTransitionContext,
	theme,
	baseline,
	area,
}) => {
	const {
		xScale,
		// to: {xScale: xScale},
		// from: {xScale: xScaleFrom},
	} = barChartTransitionContext;

	const nrTicks = 5;
	const tickFormatter = (x: number) => `${x}`;
	const xAxisSpec = getXAxisSpec(xScale, nrTicks, tickFormatter);

	return (
		<div style={{fontSize: 50, color: 'orange'}}>
			<XAxis_SpecBased
				area={area}
				xScaleCurrent={xScale}
				theme={theme.xAxis}
				xAxisSpec={xAxisSpec}
			/>
			{JSON.stringify({xAxisSpec})}
		</div>
	);
};

// import {getYear} from 'date-fns';
// import {TPeriodsScale} from '../../../periodsScale/periodsScale';

export type TXAxis = ScaleLinear<number, number>; // TODO deprecate
export type TXAxisScale = ScaleLinear<number, number>;

type TTickSpec_XAxis = {
	id: string;
	domainValue: number;
};

type TLabelSpec_XAxis = {
	id: string;
	domainValue: number;
	label: string;
	// textAnchor?: 'start' | 'middle' | 'end';
	// marginLeft?: number;
};

export type TXAxisSpec = {
	ticks: TTickSpec_XAxis[];
	labels: TLabelSpec_XAxis[];
};

// TODO continue here implementing the TXAxisSpec generators

// getXAxisSpec(
// 	scale,
// 	nTicks,
// 	formatter,
// )

export function getXAxisSpec(
	scale: TXAxis,
	nTicks: number,
	formatter: (x: number) => string
): TXAxisSpec {
	const tickValues = scale.ticks(nTicks);

	const ticks = tickValues.map((tickValue) => {
		return {
			id: `xTick-id-${tickValue}`,
			domainValue: tickValue,
		};
	});

	const labels = tickValues.map((tickValue) => {
		return {
			id: `xTickLabel-id-${tickValue}`,
			domainValue: tickValue,
			label: formatter(tickValue),
			// textAnchor: 'middle' as const,
		};
	});

	return {
		ticks,
		labels,
	};
}

export type TTheme_XAxis = {
	fontSize: number;
	// formatter: (x: number) => string;
	strokeWidth: number;
	color: string;
	tickColor: string;
};

export const XAxis_SpecBased: React.FC<{
	area: TGridLayoutArea;
	xScaleCurrent: ScaleLinear<number, number>;
	theme: TTheme_XAxis;
	// formatter: (x: number) => string;
	// yAxisSpec: TAxisSpec_Linear_Numeric;
	xAxisSpec: TXAxisSpec;
}> = ({area, xScaleCurrent, theme, xAxisSpec}) => {
	// TODO ideally these are to be found in theme// BUT multiple size options somwehow...
	// const TICK_LINE_SIZE = 20;
	// const TICK_LINE_SIZE = 24;
	// const TICK_TEXT_FONT_SIZE = 24;
	// const TICK_TEXT_FONT_WEIGHT = 500;
	// const TICK_TEXT_LEFT_PADDING = 5;

	// const yAxisSpec = getYAxisSpecFromScale(yScaleCurrent, formatter);

	return (
		<HtmlArea area={area} fill="black">
			<svg overflow="visible">
				{xAxisSpec.ticks.map((it, i) => {
					// const tickMappedValue = yAxisSpec.scale(it.value);
					const tickMappedValue = xScaleCurrent(it.domainValue);

					return (
						<g key={i}>
							<line
								x1={tickMappedValue}
								x2={tickMappedValue}
								y1={0}
								y2={40}
								stroke={theme.tickColor}
								// strokeWidth={theme.strokeWidth}
								strokeWidth={5}
							/>
						</g>
					);
				})}

				{/* update labels  */}
				{xAxisSpec.labels.map((it) => {
					const labelMappedValue = xScaleCurrent(it.domainValue);
					return (
						<g key={it.id}>
							<text
								textAnchor="middle"
								// alignmentBaseline="middle"
								alignmentBaseline="hanging"
								fill={theme.color}
								// fontSize={TICK_TEXT_FONT_SIZE}
								fontSize={40}
								fontWeight={700}
								x={labelMappedValue}
								// x={TICK_LINE_SIZE + TICK_TEXT_LEFT_PADDING}
								y={50}
							>
								{it.label}
							</text>
						</g>
					);
				})}
			</svg>
		</HtmlArea>
	);
};

// TODO think about if we here do not need getListItems_Enter
// also: these are not really hooks but just memoized functions of TListTransitionContext
const XAxisTransitionEnter: React.FC<TXAxisTransitionEnterProps> = ({
	listTransitionContext,
	barChartTransitionContext,
	theme,
	baseline,
	area,
}) => {
	const {
		// xScale,
		to: {xScale: xScaleTo},
	} = barChartTransitionContext;

	const nrTicks = 5;
	const tickFormatter = (x: number) => `${x}`;
	const xAxisSpecTo = getXAxisSpec(xScaleTo, nrTicks, tickFormatter);

	return (
		<Animated_XAxis_Enter
			frame={listTransitionContext.frame}
			durationInFrames={listTransitionContext.durationInFrames}
			startFrame={listTransitionContext.frameRange.startFrame}
			area={area}
			xScaleCurrent={xScaleTo}
			theme={theme}
			xAxisSpec={xAxisSpecTo}
			baseline={baseline}
		/>
	);
};

const XAxisTransitionExit: React.FC<TXAxisTransitionExitProps> = ({
	listTransitionContext,
	barChartTransitionContext,
	theme,
	baseline,
	area,
}) => {
	const {
		// xScale,
		from: {xScale: xScaleFrom},
	} = barChartTransitionContext;

	const nrTicks = 5;
	const tickFormatter = (x: number) => `${x}`;
	const xAxisSpecFrom = getXAxisSpec(xScaleFrom, nrTicks, tickFormatter);

	return (
		<Animated_XAxis_Exit
			frame={listTransitionContext.frame}
			durationInFrames={listTransitionContext.durationInFrames}
			startFrame={listTransitionContext.frameRange.startFrame}
			area={area}
			xScaleCurrent={xScaleFrom}
			theme={theme}
			xAxisSpec={xAxisSpecFrom}
			baseline={baseline}
		/>
	);
};
