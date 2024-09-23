import {z} from 'zod';

import {useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {
	// makeCircle,
	makeRect,
} from '@remotion/shapes';
// import {interpolatePath} from '@remotion/paths';
import {interpolate as flubberInterploate} from 'flubber';
import {ScaleLinear, scaleLinear} from 'd3-scale';

import {generateRectPath} from './generateRectPath';
import {generateCirclePath} from './generateCirclePath';
// import {makeCircle}
// import numeral from 'numeral';
// import {Sequence} from 'remotion';

import {getDomain} from './analytics';
import {data, DataItem} from './data';
import LorenzoBertoliniLogo from '../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../acetti-themes/getThemeFromEnum';

export const scatterPlotToBarChartSchema = z.object({
	themeEnum: zThemeEnum,
});

export const ScatterPlotToBarChart: React.FC<
	z.infer<typeof scatterPlotToBarChartSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
		easing: Easing.cubic,
	});

	const circlePath = generateCirclePath({r: 50, cx: 50, cy: 150});

	const rectPath = generateRectPath({
		x: 50,
		y: 100,
		width: 400,
		height: 50,
		rBottomRight: 20,
		rTopRight: 20,
	});

	// scatterplot
	const ageDomain = getDomain<DataItem>(data, 'age');
	const incomeDomain = getDomain<DataItem>(data, 'income');

	const xDomain = ageDomain;
	const yDomain = incomeDomain;

	const xScale = scaleLinear().domain(xDomain).range([0, 300]);
	const yScale = scaleLinear().domain(yDomain).range([0, 300]);

	// const interpolatedPath = interpolatePath(progress, path, rectPath);

	const flubberInterpolator = flubberInterploate(circlePath, rectPath);

	const flubberInterpolatedPath = flubberInterpolator(progress);

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<div
				style={{
					color: theme.typography.title.color,
					fontSize: 100,
					marginBottom: 50,
				}}
			>
				ScatterPlotToBarChart
			</div>

			<div
				style={{
					color: theme.typography.title.color,
					fontSize: 20,
					marginBottom: 50,
				}}
			>
				{JSON.stringify(data[0], undefined, 0)}
			</div>

			<svg style={{backgroundColor: 'cyan', width: 500, height: 300}}>
				<path d={flubberInterpolatedPath} fill={'orange'} />
			</svg>
			<div style={{position: 'relative'}}>
				<svg
					style={{
						position: 'absolute',
						top: 40,
						left: 40,
						// display: 'block',
						backgroundColor: '#303030',
						width: 300,
						height: 300,
						overflow: 'visible',
					}}
				>
					<g></g>
					{data.map((it, i) => {
						const circlePath = generateCirclePath({
							r: 20,
							cx: xScale(it.age),
							cy: yScale(it.income),
						});
						return (
							<g>
								<path d={circlePath} fill={'yellow'} />
								<circle
									cx={xScale(it.age)}
									cy={yScale(it.income)}
									fill="red"
									r={10}
								/>
							</g>
						);
					})}
				</svg>
			</div>
			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};
