import {
	Sequence,
	useVideoConfig,
	Easing,
	useCurrentFrame,
	interpolate,
} from 'remotion';

import {ThemeType} from '../../acetti-themes/themeTypes';

export const WaterfallTextEffect: React.FC<{children: string}> = ({
	children,
}) => {
	const {durationInFrames} = useVideoConfig();

	const characters = children.split('');

	const enterSequenceDurationInFrames = 120;
	let exitSequenceDurationInFrames = 200;
	let displaySequenceDurationInFrames =
		durationInFrames -
		enterSequenceDurationInFrames -
		exitSequenceDurationInFrames;

	if (displaySequenceDurationInFrames < 0) {
		exitSequenceDurationInFrames =
			exitSequenceDurationInFrames + displaySequenceDurationInFrames - 1;
		displaySequenceDurationInFrames = 1;
	}

	return (
		<>
			{/* enter animation */}
			<Sequence
				name="FadeInAndOutText_FadeInCharacters"
				durationInFrames={enterSequenceDurationInFrames}
				layout="none"
			>
				{characters.map((char, index) => (
					<FadeInCharacter delay={index * 5} fadeInDurationInFrames={30}>
						{char}
					</FadeInCharacter>
				))}
			</Sequence>
			{/* display */}
			<Sequence
				name="FadeInAndOutText_UpdateCharacters"
				layout="none"
				from={enterSequenceDurationInFrames}
				durationInFrames={displaySequenceDurationInFrames}
			>
				{characters.map((char) => (
					<span>{char}</span>
				))}
			</Sequence>
			{/* exit animation */}
			<Sequence
				name="FadeInAndOutText_FadeOutCharacters"
				layout="none"
				from={enterSequenceDurationInFrames + displaySequenceDurationInFrames}
				durationInFrames={exitSequenceDurationInFrames}
			>
				{characters.map((char, index) => (
					<FadeOutCharacter delay={index * 5} fadeOutDurationInFrames={50}>
						{char}
					</FadeOutCharacter>
				))}
			</Sequence>
		</>
	);
};

const FadeInCharacter: React.FC<{
	children: string;
	fadeInDurationInFrames?: number;
	delay: number;
}> = ({children, delay, fadeInDurationInFrames = 90}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const opacity = interpolate(
		frame,
		// [delay, delay + fadeInDurationInFrames],
		[delay, durationInFrames],
		[0, 1],
		{
			easing: Easing.cubic,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	return <span style={{opacity}}>{children}</span>;
};

const FadeOutCharacter: React.FC<{
	children: string;
	fadeOutDurationInFrames?: number;
	delay: number;
}> = ({children, delay, fadeOutDurationInFrames = 60}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const opacity = interpolate(
		frame,
		// [delay, delay + fadeOutDurationInFrames],
		// [delay, durationInFrames],
		[delay, durationInFrames],
		[1, 0],
		{
			easing: Easing.cubic,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	return <span style={{opacity}}>{children}</span>;
};

const getTitleStyles = (theme: ThemeType) => {
	const titleStyles = {
		fontWeight: 700,
		fontFamily: theme.typography.title.fontFamily,
		color: theme.typography.title.color,
	};
	return titleStyles;
};

const getSubTitleStyles = (theme: ThemeType) => {
	const subTitleStyles = {
		fontWeight: 500,
		fontFamily: theme.typography.subTitle.fontFamily,
		color: theme.typography.subTitle.color,
	};
	return subTitleStyles;
};