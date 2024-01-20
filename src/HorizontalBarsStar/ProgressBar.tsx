import {
	AbsoluteFill,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

import {z} from 'zod';
import {zColor} from '@remotion/zod-types';

const progressBarSchema = z.object({
	color: zColor(),
});

// https://easings.net/
function easeInOutExpo(x: number): number {
	return x === 0
		? 0
		: x === 1
		? 1
		: x < 0.5
		? Math.pow(2, 20 * x - 10) / 2
		: (2 - Math.pow(2, -20 * x + 10)) / 2;
}

function easeInCirc(x: number): number {
	return 1 - Math.sqrt(1 - Math.pow(x, 2));
}

function easeOutQuint(x: number): number {
	return 1 - Math.pow(1 - x, 5);
}

const easings = {
	easeInCirc,
	easeInOutExpo,
	easeOutQuint,
};

export const ProgressBar: React.FC<z.infer<typeof progressBarSchema>> = ({
	color,
}) => {
	const frame = useCurrentFrame();
	const {durationInFrames, width, height} = useVideoConfig();

	const percentageProgress = frame / durationInFrames;

	const zero_to_1 = easings.easeInOutExpo(percentageProgress);

	const starOpacity = interpolate(zero_to_1, [0, 0.97, 1], [1, 1, 1]);
	const starHeight = interpolate(zero_to_1, [0, 0.1, 1], [50, 50, 50]);
	const starMarginLeft = interpolate(zero_to_1, [0, 0.1, 1], [-50, -5, -5]);

	const percentageProgress_01 = zero_to_1;

	const marginTop = 150;
	const lineHeight = 2;

	return (
		<AbsoluteFill>
			<svg width={width} height={height}>
				<rect
					x={0}
					y={marginTop - lineHeight / 2}
					fill={color}
					height={lineHeight}
					width={percentageProgress_01 * width}
				/>

				<g
					transform={`translate(${
						percentageProgress_01 * width + starMarginLeft
					},${marginTop - starHeight / 2})`}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width={starHeight}
						height={starHeight}
						opacity={starOpacity}
						fillRule="evenodd"
						strokeLinejoin="round"
						strokeMiterlimit="2"
						clipRule="evenodd"
						viewBox="0 0 3084 3084"
					>
						<path
							fillRule="nonzero"
							fill={color}
							d="M1541.11 0c-93.982 586.279-172.953 934.796-389.635 1151.48-216.681 216.682-565.198 295.653-1151.48 389.635 586.279 93.982 934.796 172.953 1151.48 390.287 216.682 216.681 295.653 565.198 389.635 1151.93 93.982-586.736 172.953-935.253 389.634-1152.59 217.334-216.681 565.851-295.652 1152.59-389.634-586.736-93.982-935.253-172.953-1151.93-389.635C1714.07 934.792 1635.099 586.275 1541.117-.007z"
						></path>
					</svg>
					);
				</g>
			</svg>
		</AbsoluteFill>
	);
};
