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

	// FLY IN INFORMATION
	// *****************************************************
	const FLY_IN_CHARACTER_DURATION = Math.floor(90 * 0.4);
	const FLY_IN_LAST_CHARACTER_DELAY = Math.floor(90 * 0.5);

	const FLY_IN_TOTAL_DURATION =
		FLY_IN_LAST_CHARACTER_DELAY + FLY_IN_CHARACTER_DURATION;

	const getFlyInCharacterDelay = (index: number) => {
		const delay = interpolate(
			index,
			[0, characters.length - 1],
			[0, FLY_IN_LAST_CHARACTER_DELAY],
			{
				easing: Easing.ease,
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		return Math.floor(delay);
	};

	const enterSequenceDurationInFrames = FLY_IN_TOTAL_DURATION;
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
				name="WaterfallTextEffect_EnterCharacters"
				durationInFrames={enterSequenceDurationInFrames}
				layout="none"
			>
				{characters.map((char, index) => (
					<FlyDownCharacter
						delay={getFlyInCharacterDelay(index)}
						fadeInDurationInFrames={FLY_IN_CHARACTER_DURATION}
					>
						{char}
					</FlyDownCharacter>
				))}
			</Sequence>
			{/* display */}
			<Sequence
				name="WaterfallTextEffect_UpdateCharacters"
				layout="none"
				from={enterSequenceDurationInFrames}
				durationInFrames={displaySequenceDurationInFrames}
			>
				{characters.map((char) => (
					<span
						style={{
							display: 'inline-block',
						}}
					>
						{char}
					</span>
				))}
			</Sequence>
			{/* exit animation */}
			<Sequence
				name="WaterfallTextEffect_ExitCharacters"
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

const FlyDownCharacter: React.FC<{
	children: string;
	fadeInDurationInFrames: number;
	delay: number;
}> = ({children, delay, fadeInDurationInFrames}) => {
	const frame = useCurrentFrame();

	const opacity = interpolate(
		frame,
		[delay, delay + fadeInDurationInFrames],
		[0, 1],
		{
			easing: Easing.cubic,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const translateY = interpolate(
		frame,
		[delay, delay + fadeInDurationInFrames],
		[-400, 0],
		{
			easing: Easing.cubic,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	return (
		<span
			style={{
				opacity,
				transform: `translateY(${translateY}px)`,
				display: 'inline-block',
			}}
		>
			{children}
		</span>
	);
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

	return (
		<span
			style={{
				opacity,

				display: 'inline-block',
			}}
		>
			{children}
		</span>
	);
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
