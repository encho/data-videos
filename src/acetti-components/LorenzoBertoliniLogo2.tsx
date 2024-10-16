import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThemeType} from '../acetti-themes/themeTypes';

export const LorenzoBertoliniLogo2 = ({theme}: {theme: ThemeType}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const color = theme.typography.logoColor;
	const fontSize = 36; // TODO from theme or pageContext or typographyContext or so

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
				bottom: 40, // todo from pageContext
				right: 40, // todo from pageContext
			}}
		>
			<div style={{color, fontSize}}>
				<span style={{fontFamily: 'Inter-Regular'}}>lorenzo</span>
				<span style={{fontFamily: 'Inter-Bold'}}>bertolini</span>
			</div>
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
