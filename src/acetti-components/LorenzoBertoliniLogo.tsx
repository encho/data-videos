import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

const LorenzoBertoliniLogo = ({color}: {color: string}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entryDurationInFrames = fps * 1;

	const percentageProgress = frame / entryDurationInFrames;

	const barProgress = interpolate(percentageProgress, [0, 0.5], [0, 1], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
	});

	const zero_to_1 = easings.easeOutQuint(barProgress);

	return (
		<div
			className="absolute"
			style={{
				opacity: zero_to_1,
				bottom: 40,
				right: 40,
			}}
		>
			<div style={{color, fontSize: 40}}>
				<span className="font-thin">lorenzo</span>
				<span className="font-medium">bertolini</span>
			</div>
		</div>
	);
};

export default LorenzoBertoliniLogo;

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
