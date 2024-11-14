import {
	AbsoluteFill,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

export const SimpleTitle: React.FC<{
	children: React.ReactNode;
	color: string;
	fontSize: number;
}> = ({children, color, fontSize}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const percentageProgress = frame / durationInFrames;

	const quickerProgress = interpolate(percentageProgress, [0, 0.2], [0, 1], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
	});

	const zero_to_1 = easings.easeInOutExpo(quickerProgress);

	return (
		<AbsoluteFill>
			<div className="flex items-center" style={{height: 150}}>
				<h1
					style={{
						color,
						fontSize,
						fontFamily: 'sans-serif',
						marginLeft: 40 - (1 - zero_to_1) * 1500,
						fontWeight: 500,
					}}
				>
					{children}
				</h1>
			</div>
		</AbsoluteFill>
	);
};

// https://easings.net/
function easeInOutExpo(x: number): number {
	return x === 0
		? 0
		: x === 1
		? 1
		: x < 0.5
		? 2**(20 * x - 10) / 2
		: (2 - 2**(-20 * x + 10)) / 2;
}

function easeInCirc(x: number): number {
	return 1 - Math.sqrt(1 - x**2);
}

function easeOutQuint(x: number): number {
	return 1 - (1 - x)**5;
}

const easings = {
	easeInCirc,
	easeInOutExpo,
	easeOutQuint,
};
