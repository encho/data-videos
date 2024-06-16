import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import {max, min} from 'd3-array';
import {scaleLinear} from 'd3-scale';
import {line} from 'd3-shape';
import {useCurrentFrame, useVideoConfig, spring} from 'remotion';

import {getLabelMappedValue, getTickMappedValue} from '../acetti-axis/axisSpec';

import {FontFamiliesUnionType} from '../acetti-typography/fontSpecs';
import {
	DisplayGridLayout,
	TGridLayoutAreaSpec,
	TGridRailSpec,
	useGridLayout,
} from '../acetti-layout';
import {getXAxisSpec} from '../acetti-axis/getXAxisSpec';

export function LineChartBody({
	areaWidth,
	areaHeight,
	fontFamilyXTicklabels,
	fontFamilyYTicklabels,
	data,
	styling,
	showZero,
	showLayout = false,
}: {
	areaWidth: number;
	areaHeight: number;
	data: {index: Date; value: number}[];
	showZero: boolean;
	showLayout?: boolean;
	fontFamilyYTicklabels: FontFamiliesUnionType;
	fontFamilyXTicklabels: FontFamiliesUnionType;
	styling: {
		gridLinesColor: string;
		yLabelsColor: string;
		xLabelsColor: string;
		lineColor: string;
		yAxisAreaWidth: number;
		lineStrokeWidth: number;
		lineCircleRadius: number;
		yTickValuesFontSize: number;
		xTickValuesFontSize: number;
		xAxisAreaHeight: number;
		gridLinesStrokeWidth: number;
		yAxisAreaMarginLeft: number;
		xTickValuesLength: number;
		xTickValuesWidth: number;
		xTickValuesColor: string;
	};
}) {
	const frame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();

	const spr = spring({
		fps,
		frame,
		config: {damping: 300},
		durationInFrames: durationInFrames / 2,
	});

	const percentageAnimation = spr;

	const chartRowsRailSpec: TGridRailSpec = [
		{type: 'fr', value: 1, name: 'plot'},
		{type: 'pixel', value: styling.xAxisAreaHeight, name: 'xAxis'},
	];
	const chartColsRailSpec: TGridRailSpec = [
		{type: 'fr', value: 1, name: 'plot'},
		{type: 'pixel', value: styling.yAxisAreaMarginLeft, name: 'space'},
		{type: 'pixel', value: styling.yAxisAreaWidth, name: 'yAxis'},
	];

	const chartGridLayoutSpec = {
		padding: 0,
		columnGap: 0,
		rowGap: 0,
		rows: chartRowsRailSpec,
		columns: chartColsRailSpec,
		areas: {
			xAxis: [
				{name: 'xAxis'},
				{name: 'plot'},
				{name: 'xAxis'},
				{name: 'plot'},
			] as TGridLayoutAreaSpec,
			yAxis: [
				{name: 'plot'},
				{name: 'yAxis'},
				{name: 'plot'},
				{name: 'yAxis'},
			] as TGridLayoutAreaSpec,
			plot: [
				{name: 'plot'},
				{name: 'plot'},
				{name: 'plot'},
				{name: 'plot'},
			] as TGridLayoutAreaSpec,
		},
	};

	const chartLayout = useGridLayout({
		width: areaWidth,
		height: areaHeight,
		gridLayoutSpec: chartGridLayoutSpec,
	});

	const xAxisSpecFull = getXAxisSpec(
		data.map((it) => it.index),
		chartLayout.areas.plot
	);

	// TODO if we ensure that array is not empty we would not have to perform the casting
	const yDomainMin = min(data, (it) => it.value) as number;
	const yDomainMax = max(data, (it) => it.value) as number;
	const yDomainDiff = yDomainMax - yDomainMin;
	// TODO padding conditional on input flag
	const yPadding = yDomainDiff * 0.1;
	const yDomainBounded = [yDomainMax + yPadding, yDomainMin - yPadding];

	const yDomainZero = [yDomainMax, 0];

	const yDomain = showZero ? yDomainZero : yDomainBounded;

	const yScale = scaleLinear()
		.domain(yDomain)
		// .domain([max(data.map((it) => it.value)) as number, 0])
		.range([chartLayout.areas.plot.y1, chartLayout.areas.plot.y2]);
	// .nice();
	const linePath = line<{index: Date; value: number}>()
		.x((d) => xAxisSpecFull.scale(d.index))
		.y((d) => yScale(d.value));
	// .curve(curveBasis);
	// .curve(curveCatmullRom.alpha(0.5));

	const d = linePath(data) || '';
	const pathLength = d ? getLength(d) : 0;
	// const percentageAnimation = Math.min(frame / (durationInFrames / 2), 1);
	const pointAtLength = getPointAtLength(d, percentageAnimation * pathLength);
	const evolvedPath = evolvePath(percentageAnimation, d);

	const tickValues = yScale.nice().ticks(5);

	return (
		<div style={{position: 'relative'}}>
			<div style={{position: 'absolute'}}>
				<DisplayGridLayout
					// hide={!showLayout}
					hide={false}
					areas={chartLayout.areas}
					width={areaWidth}
					height={areaHeight}
				/>
			</div>
			<div style={{position: 'absolute'}}>
				<svg
					width={areaWidth}
					height={areaHeight}
					style={{
						overflow: 'visible',
					}}
				>
					{/* gridlines */}
					{tickValues.map((tickValue) => {
						return (
							<g key={`gridline-${tickValue}`}>
								<line
									x1={chartLayout.areas.plot.x1}
									x2={chartLayout.areas.plot.x2}
									y1={yScale(tickValue)}
									y2={yScale(tickValue)}
									stroke={styling.gridLinesColor}
									strokeWidth={styling.gridLinesStrokeWidth}
								/>
							</g>
						);
					})}

					{/* y ticks */}
					{tickValues.map((tickValue) => {
						return (
							<g key={tickValue}>
								<text
									x={chartLayout.areas.yAxis.x2}
									y={yScale(tickValue)}
									fontFamily={fontFamilyYTicklabels}
									fontSize={styling.yTickValuesFontSize}
									fill={styling.yLabelsColor}
									textAnchor="end"
									alignmentBaseline="central"
								>
									{tickValue}
								</text>
							</g>
						);
					})}

					{/* xAxis line */}
					<g>
						<line
							x1={xAxisSpecFull.scale(xAxisSpecFull.domain[0])}
							x2={xAxisSpecFull.scale(xAxisSpecFull.domain[1])}
							y1={chartLayout.areas.xAxis.y1}
							y2={chartLayout.areas.xAxis.y1}
							stroke={styling.xTickValuesColor}
							strokeWidth={styling.xTickValuesWidth}
						/>
					</g>

					{/* xAxis ticks */}
					{xAxisSpecFull.ticks.map((it, i) => {
						const tickMappedValue = getTickMappedValue(xAxisSpecFull, it.id);

						return (
							<g key={i}>
								<line
									x1={tickMappedValue}
									x2={tickMappedValue}
									y1={chartLayout.areas.xAxis.y1}
									// TODO pass tickLength from styling
									y2={chartLayout.areas.xAxis.y1 + styling.xTickValuesLength}
									stroke={styling.xTickValuesColor}
									strokeWidth={styling.xTickValuesWidth}
								/>
							</g>
						);
					})}

					{/* xAxis labels */}
					{xAxisSpecFull.labels.map((currentLabel, i) => {
						return (
							<g key={i}>
								<text
									textAnchor={currentLabel.textAnchor || 'start'}
									// textAnchor={currentLabel.textAnchor}
									alignmentBaseline="baseline"
									fill={styling.xLabelsColor}
									fontFamily={fontFamilyXTicklabels}
									fontSize={styling.xTickValuesFontSize}
									x={getLabelMappedValue(xAxisSpecFull, currentLabel.id)}
									y={chartLayout.areas.xAxis.y2}
								>
									{currentLabel.label}
								</text>
							</g>
						);
					})}

					{/* the animated line */}
					{d ? (
						<g>
							<path
								d={d}
								strokeDasharray={evolvedPath.strokeDasharray}
								strokeDashoffset={evolvedPath.strokeDashoffset}
								stroke={styling.lineColor}
								strokeWidth={styling.lineStrokeWidth}
								fill="transparent"
							/>

							<circle
								cx={pointAtLength.x}
								cy={pointAtLength.y}
								fill={styling.lineColor}
								r={styling.lineCircleRadius}
							/>
						</g>
					) : null}
				</svg>
			</div>
		</div>
	);
}
