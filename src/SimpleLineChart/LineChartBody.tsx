import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import {max, min} from 'd3-array';
import {scaleLinear, scaleTime, ScaleTime} from 'd3-scale';
import {line} from 'd3-shape';
import {useCurrentFrame, useVideoConfig, spring} from 'remotion';

import {
	getLabelMappedValue,
	getTickMappedValue,
	TAxisSpec,
} from '../AxisTransition/axisSpec';

import {FontFamiliesUnionType} from '../fontSpecs';
import {
	DisplayGridLayout,
	TGridLayoutAreaSpec,
	TGridRailSpec,
	useGridLayout,
} from '../acetti-viz';
import {getDateSpanCategory} from './utils';

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

	const minDate = min(data.map((it) => it.index)) as Date;
	const maxDate = max(data.map((it) => it.index)) as Date;

	// information to determine looks of x-axis
	const dateSpanCategory = getDateSpanCategory(minDate, maxDate);

	// TODO const xAxisSpec = getXAxisSpec(timeseriesData)

	// TODO this only in specific dateSpanCategories, otherwise keep minDate,maxDate domain
	const xTickValuesMonthBoundaries = generateMonthBoundariesDates(
		minDate,
		maxDate
	);

	const xScaleDomain = [
		xTickValuesMonthBoundaries[0],
		xTickValuesMonthBoundaries[xTickValuesMonthBoundaries.length - 1],
	] as [Date, Date];

	const xScaleRange = [chartLayout.areas.plot.x1, chartLayout.areas.plot.x2];

	// QUICK-FIX determine why we have to cast to any here
	const xScale: ScaleTime<Date, number> = scaleTime()
		.domain(xScaleDomain)
		.range(xScaleRange) as any;

	const xAxisSpec: TAxisSpec = {
		domain: xScaleDomain,
		range: [chartLayout.areas.plot.x1, chartLayout.areas.plot.x2],
		scale: xScale,
		ticks: [],
		labels: [],
	};

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
		.x((d) => xScale(d.index))
		.y((d) => yScale(d.value));
	// .curve(curveBasis);
	// .curve(curveCatmullRom.alpha(0.5));

	const d = linePath(data) || '';
	const pathLength = d ? getLength(d) : 0;
	// const percentageAnimation = Math.min(frame / (durationInFrames / 2), 1);
	const pointAtLength = getPointAtLength(d, percentageAnimation * pathLength);
	const evolvedPath = evolvePath(percentageAnimation, d);

	const tickValues = yScale.nice().ticks(5);

	const monthStrings = getAllButLast(xTickValuesMonthBoundaries).map((it) =>
		// TODO paramterrization from props
		getMonthString(it, 'veryShort')
	);

	// TODO: here we have mapped values already we may need to integrate this in axisSpec
	// these tick values
	const xTickValuesMonthStartsMapped = xTickValuesMonthBoundaries.map((d) =>
		xScale(d)
	);

	const axisTickSpecs = xTickValuesMonthStartsMapped.map((n: number) => {
		const id = n.toString();
		return {id, value: n, type: 'MAPPED_VALUE' as const};
	});

	// TODO: here we have mapped values already we may need to integrate this in axisSpec
	const xTickValuesMonthCentroids = calculateAveragesBetweenNumbers(
		xTickValuesMonthStartsMapped
	);

	const xAxisLabels = xTickValuesMonthCentroids.map((it, i) => {
		return {
			id: monthStrings[i],
			label: monthStrings[i],
			value: it,
			type: 'MAPPED_VALUE' as const,
			textAnchor: 'middle' as const,
		};
	});

	const xAxisSpecFull: TAxisSpec = {
		domain: xScaleDomain,
		range: [chartLayout.areas.plot.x1, chartLayout.areas.plot.x2],
		scale: xScale,
		ticks: axisTickSpecs,
		labels: xAxisLabels,
	};

	return (
		<div style={{position: 'relative'}}>
			<div style={{position: 'absolute'}}>
				<DisplayGridLayout
					hide={!showLayout}
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
									// TODO textAnchor has to be specified in currentLabel
									// textAnchor="middle"
									textAnchor={currentLabel.textAnchor || 'start'}
									alignmentBaseline="baseline"
									// fill={styling.xLabelsColor}
									fill={'cyan'}
									fontFamily={fontFamilyXTicklabels}
									fontSize={styling.xTickValuesFontSize}
									x={getLabelMappedValue(xAxisSpecFull, currentLabel.id)}
									// x={currentLabel.value}
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

function getAllButLast(arr: any[]): any[] {
	if (arr.length <= 1) {
		return [];
	}

	return arr.slice(0, arr.length - 1);
}
function getMonthString(
	date: Date,
	format: 'long' | 'short' | 'veryShort' = 'long'
): string {
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	const shortMonths = months.map((month) => month.slice(0, 3));
	const veryShortMonths = months.map((month) => month.slice(0, 1));

	switch (format) {
		case 'long':
			return months[date.getMonth()];
		case 'short':
			return shortMonths[date.getMonth()];
		case 'veryShort':
			return veryShortMonths[date.getMonth()];
		default:
			return months[date.getMonth()];
	}
}

function generateMonthBoundariesDates(minDate: Date, maxDate: Date): Date[] {
	const result: Date[] = [];

	// Function to check if a date is the first day of the month
	const isFirstDayOfMonth = (date: Date) => date.getDate() === 1;

	// Function to get the last day of the month
	const getLastDayOfMonth = (date: Date) =>
		new Date(date.getFullYear(), date.getMonth() + 1, 0);

	// Handle the minDate
	if (!isFirstDayOfMonth(minDate)) {
		result.push(new Date(minDate.getFullYear(), minDate.getMonth(), 1));
	} else {
		result.push(minDate);
	}

	// Generate the first day of each month between minDate and maxDate
	let currentDate = new Date(minDate);
	while (currentDate < maxDate) {
		currentDate = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth() + 1,
			1
		);
		if (currentDate <= maxDate) {
			result.push(currentDate);
		}
	}

	// Handle the maxDate as an exception
	if (maxDate <= getLastDayOfMonth(maxDate)) {
		result.push(getLastDayOfMonth(maxDate));
	}

	return result;
}

function calculateAveragesBetweenNumbers(numbers: number[]): number[] {
	const result: number[] = [];

	for (let i = 0; i < numbers.length - 1; i++) {
		const average = (numbers[i] + numbers[i + 1]) / 2;
		result.push(average);
	}

	return result;
}
