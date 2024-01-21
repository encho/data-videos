import {Img, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

// const LORENZO_BLACK = '#222';
// const LORENZO_WHITE = '#FFF';

// const COLORS = {
// 	background: '#1c2541',
// 	text: '#CAD8DE',
// 	placements: {
// 		champions: '#76E7CD',
// 		uefa: '#9B7EDE',
// 		uefaConference: '#C45BAA',
// 	},
// };

// const FLIC_COLORS = {
// 	background: LORENZO_BLACK,
// 	progressColor: 'transparent',
// 	title: LORENZO_WHITE,
// 	bar: {
// 		// background: LORENZO_BLACK,
// 		background: LORENZO_WHITE,
// 		text: LORENZO_BLACK,
// 		placements: {
// 			champions: '#76E7CD',
// 			uefa: '#9B7EDE',
// 			uefaConference: '#C45BAA',
// 		},
// 	},
// };

const LorenzoBertoliniLogo = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const percentageProgress = frame / durationInFrames;

	const barProgress = interpolate(percentageProgress, [0, 0.5], [0, 1], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
	});

	const zero_to_1 = easings.easeOutQuint(barProgress);

	return (
		<div
			className="absolute bottom-8 right-8"
			style={{
				opacity: zero_to_1,
			}}
		>
			<div className="text-white text-3xl">
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
