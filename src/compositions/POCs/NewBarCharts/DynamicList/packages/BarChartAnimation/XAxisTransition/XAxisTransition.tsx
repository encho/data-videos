import React from 'react';
import invariant from 'tiny-invariant';
import {ScaleLinear} from 'd3-scale';

import {Animated_XAxis_Enter} from './Animated_XAxis_Enter/Animated_XAxis_Enter';
import {Animated_XAxis_Exit} from './Animated_XAxis_Exit/Animated_XAxis_Exit';
import {Animated_XAxis_Update} from './Animated_XAxis_Update/Animated_XAxis_Update';
import {TGridLayoutArea} from '../../../../../../../acetti-layout';
import {
	ListTransitionContext_Update,
	ListTransitionContext_Enter,
	ListTransitionContext_Exit,
} from '../../ListAnimation/useListTransition/useListTransition';
import {
	TBarChartTransitionContext,
	BarChartTransitionContext_Enter,
	BarChartTransitionContext_Update,
	BarChartTransitionContext_Exit,
} from '../useBarChartTransition/useBarChartTransition';
import {TBarChartItem} from '../useBarChartTransition/useBarChartTransition';
import {TKeyFramesGroup} from '../../../../../Keyframes/Keyframes/keyframes';
import {ThemeType} from '../../../../../../../acetti-themes/themeTypes';

type TXAxisTransitionCommonProps = {
	theme: ThemeType;
	baseline: number;
	area: TGridLayoutArea;
	nrTicks?: number;
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
	nrTicks?: number;
};

export const XAxisTransition: React.FC<TXAxisTransitionProps> = ({
	listTransitionContext,
	barChartTransitionContext,
	theme,
	baseline,
	area,
	nrTicks,
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
				nrTicks={nrTicks}
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
				nrTicks={nrTicks}
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
			nrTicks={nrTicks}
		/>
	);
};

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

// TODO think about if we here do not need getListItems_Enter
// also: these are not really hooks but just memoized functions of TListTransitionContext
const XAxisTransitionEnter: React.FC<TXAxisTransitionEnterProps> = ({
	listTransitionContext,
	barChartTransitionContext,
	theme,
	baseline,
	area,
	nrTicks = 5,
}) => {
	const {
		// xScale,
		to: {xScale: xScaleTo},
	} = barChartTransitionContext;

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
	nrTicks = 5,
}) => {
	const {
		// xScale,
		from: {xScale: xScaleFrom},
	} = barChartTransitionContext;

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

const XAxisTransitionUpdate: React.FC<TXAxisTransitionUpdateProps> = ({
	listTransitionContext,
	barChartTransitionContext,
	theme,
	baseline,
	area,
	nrTicks = 5,
}) => {
	const {
		xScale,
		to: {xScale: xScaleTo},
		from: {xScale: xScaleFrom},
	} = barChartTransitionContext;

	const tickFormatter = (x: number) => `${x}`;
	const xAxisSpecFrom = getXAxisSpec(xScaleFrom, nrTicks, tickFormatter);
	const xAxisSpecTo = getXAxisSpec(xScaleTo, nrTicks, tickFormatter);

	return (
		<Animated_XAxis_Update
			frame={listTransitionContext.frame}
			durationInFrames={listTransitionContext.durationInFrames}
			startFrame={listTransitionContext.frameRange.startFrame}
			area={area}
			xScaleCurrent={xScale}
			theme={theme}
			xAxisSpecFrom={xAxisSpecFrom}
			xAxisSpecTo={xAxisSpecTo}
			baseline={baseline}
		/>
	);
};
