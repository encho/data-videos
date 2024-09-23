import {z} from 'zod';
import {useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {interpolate as flubberInterploate} from 'flubber';

import {generateCirclePath} from './generateCirclePath';
import {generateRectPath} from './generateRectPath';
import LorenzoBertoliniLogo from '../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../acetti-themes/getThemeFromEnum';

export const circleToRectPathSchema = z.object({
	themeEnum: zThemeEnum,
});

export const CircleToRectPath: React.FC<
	z.infer<typeof circleToRectPathSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
		easing: Easing.cubic,
	});

	const circlePath = generateCirclePath({r: 50, cx: 150, cy: 350});
	const rectPath = generateRectPath({
		x: 50,
		y: 100,
		width: 400,
		height: 50,
		rBottomRight: 20,
		rTopRight: 20,
	});

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
				Circle to Rect Path Animation POC
			</div>

			<div
				style={{
					color: theme.typography.title.color,
					fontSize: 20,
					marginBottom: 50,
				}}
			>
				{circlePath}
			</div>

			<div
				style={{
					color: theme.typography.title.color,
					fontSize: 20,
					marginBottom: 50,
				}}
			>
				{rectPath}
			</div>

			<div
				style={{
					color: theme.typography.title.color,
					fontSize: 20,
					marginBottom: 50,
				}}
			>
				{progress}
			</div>

			<svg style={{backgroundColor: 'cyan', width: 500, height: 500}}>
				<path opacity={0.3} d={rectPath} fill={'black'} />
				<path opacity={0.3} d={circlePath} fill={'black'} />
				<path d={flubberInterpolatedPath} fill={'orange'} />
			</svg>
			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};
