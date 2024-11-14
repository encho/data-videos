// import {Img} from 'remotion';
import {Img, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

// USAGE EXAMPLE:
// ****************************************************************
// <FooterLogo />

export const FooterLogo: React.FC<{}> = (
	{
		// theme,
		// watermark,
		// baselines,
	}
) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const percentageProgress = frame / durationInFrames;

	const barProgress = interpolate(percentageProgress, [0, 0.5], [0, 1], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
	});

	// const zero_to_1 = easings.easeInOutExpo(barProgress);
	// const zero_to_1 = easings.easeInCirc(barProgress);
	const zero_to_1 = easings.easeOutQuint(barProgress);

	return (
		<div className="flex justify-center items-center mt-12">
			<Img
				style={{
					opacity: zero_to_1,
					display: 'inline-block',
					height: 50,
					objectFit: 'contain',
				}}
				src="https://s3.eu-central-1.amazonaws.com/nerdy.finance/nerdy-finance-logo.png"
				alt=""
			/>
		</div>
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
