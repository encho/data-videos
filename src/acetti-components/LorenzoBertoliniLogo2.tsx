import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThemeType} from '../acetti-themes/themeTypes';

export const LorenzoBertoliniLogo2 = ({
	theme,
	color: colorProp,
}: {
	theme: ThemeType;
	color?: string;
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const color = colorProp || theme.typography.logoColor;
	const fontSize = 32; // TODO from theme or pageContext or typographyContext or so

	const entryDurationInFrames = fps * 1;

	const percentageProgress = frame / entryDurationInFrames;
	// const percentageProgress = 1;

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
			<JustLorenzoLogo color={color} theme={theme} fontSize={fontSize} />
			{/* <div style={{color, fontSize}}>
				<span style={{fontFamily: 'Inter-Regular'}}>lorenzo</span>
				<span style={{fontFamily: 'Inter-Bold'}}>bertolini</span>
			</div> */}
		</div>
	);
};

export const JustLorenzoLogo = ({
	theme,
	color: colorProp,
	fontSize = 32,
}: {
	theme: ThemeType;
	color?: string;
	fontSize?: number;
}) => {
	// const fontSize = 32;
	const color = colorProp || theme.typography.logoColor;

	return (
		<div style={{color, fontSize}}>
			<span style={{fontFamily: 'Inter-Regular'}}>lorenzo</span>
			<span style={{fontFamily: 'Inter-Bold'}}>bertolini</span>
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
