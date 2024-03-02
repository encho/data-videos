import {AbsoluteFill} from 'remotion';
import {z} from 'zod';
import {zColor} from '@remotion/zod-types';
import {max, min} from 'd3-array';
import {useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {scaleLinear, scaleTime} from 'd3-scale';

type TickSpec = {
	id: string;
	value: Date;
};

type AxisSpec = {
	domain: [Date, Date];
	range: [number, number];
	ticks: TickSpec[];
	// labels: LabelsSpec[];
};

const axisStart: AxisSpec = {
	domain: [new Date(2019, 10, 20), new Date(2022, 10, 5)],
	range: [100, 1080 - 100],
	ticks: [
		{id: '01-01-2020', value: new Date(2020, 0, 1)},
		{id: '01-02-2021', value: new Date(2021, 1, 1)},
	],
	// labels:
};

const axisEnd: AxisSpec = {
	domain: [new Date(2020, 10, 20), new Date(2023, 10, 5)],
	range: [100, 1080 - 100],
	ticks: [
		{id: '01-02-2021', value: new Date(2021, 1, 1)},
		{id: '01-02-2022', value: new Date(2022, 1, 1)},
		{id: '01-10-2022', value: new Date(2022, 9, 1)},
	],
	// labels:
};

export const AxisTransitionSchema = z.object({
	backgroundColor: zColor(),
	textColor: zColor(),
});

export const AxisTransition: React.FC<z.infer<typeof AxisTransitionSchema>> = ({
	backgroundColor,
	textColor,
}) => {
	// TODO perhaps part of AxisSpec?
	const xScaleStart = scaleTime()
		.domain(axisStart.domain)
		.range(axisStart.range);
	const xScaleEnd = scaleTime().domain(axisEnd.domain).range(axisEnd.range);

	const axisStart_lineX1 = xScaleStart(axisStart.domain[0]);
	const axisStart_lineX2 = xScaleStart(axisStart.domain[1]);

	const axisEnd_lineX1 = xScaleEnd(axisEnd.domain[0]);
	const axisEnd_lineX2 = xScaleEnd(axisEnd.domain[1]);

	console.log({axisStart_lineX1, axisStart_lineX2});

	return (
		<AbsoluteFill style={{backgroundColor}}>
			<h1 style={{color: textColor, fontSize: 50}}>hello axis transition</h1>

			<svg width={1080} height={500} style={{backgroundColor: 'green'}}>
				{/* startAxis: x axis line */}
				<g>
					<line
						x1={axisStart_lineX1}
						x2={axisStart_lineX2}
						y1={100}
						y2={100}
						stroke={textColor}
						strokeWidth={4}
					/>
				</g>

				{/* endAxis: x axis line */}
				<g>
					<line
						x1={axisEnd_lineX1}
						x2={axisEnd_lineX2}
						y1={300}
						y2={300}
						stroke={textColor}
						strokeWidth={4}
					/>
				</g>

				{/* axis start: x ticks */}
				{axisStart.ticks.map((it, i) => {
					return (
						<g key={i}>
							<line
								x1={xScaleStart(it.value)}
								x2={xScaleStart(it.value)}
								y1={100}
								y2={120}
								stroke={textColor}
								strokeWidth={4}
							/>
						</g>
					);
				})}

				{/* axis end: x ticks */}
				{axisEnd.ticks.map((it, i) => {
					return (
						<g key={i}>
							<line
								x1={xScaleEnd(it.value)}
								x2={xScaleEnd(it.value)}
								y1={300}
								y2={320}
								stroke={textColor}
								strokeWidth={4}
							/>
						</g>
					);
				})}
			</svg>
		</AbsoluteFill>
	);
};
