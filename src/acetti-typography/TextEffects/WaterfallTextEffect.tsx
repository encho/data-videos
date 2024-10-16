import {
	Sequence,
	useVideoConfig,
	Easing,
	useCurrentFrame,
	interpolate,
} from 'remotion';

export const WaterfallTextEffect: React.FC<{children: string}> = ({
	children,
}) => {
	const {durationInFrames} = useVideoConfig();

	const characters = children.split('');

	// FLY IN INFORMATION
	// *****************************************************
	const FLY_IN_CHARACTER_DURATION = Math.floor(90 * 0.35);
	const FLY_IN_AVG_DELAY_PER_CHARACTER = Math.floor(90 * 0.05);
	const FLY_IN_LARGEST_CHARACTER_DELAY =
		(characters.length - 1) * FLY_IN_AVG_DELAY_PER_CHARACTER;

	const FLY_IN_TOTAL_DURATION =
		FLY_IN_LARGEST_CHARACTER_DELAY + FLY_IN_CHARACTER_DURATION;

	const getFlyInCharacterDelay = (index: number) => {
		const delay = interpolate(
			index,
			[0, characters.length - 1],
			[0, FLY_IN_LARGEST_CHARACTER_DELAY],
			{
				easing: Easing.ease,
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		return Math.floor(delay);
	};

	// FLY OUT INFORMATION
	// *****************************************************
	const FLY_OUT_CHARACTER_DURATION = Math.floor(90 * 0.35);
	const FLY_OUT_AVG_DELAY_PER_CHARACTER = Math.floor(90 * 0.05);
	const FLY_OUT_LARGEST_CHARACTER_DELAY =
		(characters.length - 1) * FLY_OUT_AVG_DELAY_PER_CHARACTER;

	const FLY_OUT_TOTAL_DURATION =
		FLY_OUT_LARGEST_CHARACTER_DELAY + FLY_OUT_CHARACTER_DURATION;

	const getFlyOutCharacterDelay = (index: number) => {
		const delay = interpolate(
			index,
			[0, characters.length - 1],
			[FLY_OUT_LARGEST_CHARACTER_DELAY, 0],
			{
				easing: Easing.ease,
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		return Math.floor(delay);
	};

	const enterSequenceDurationInFrames = FLY_IN_TOTAL_DURATION;
	let exitSequenceDurationInFrames = FLY_OUT_TOTAL_DURATION;
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
					<EnterCharacter
						delay={getFlyInCharacterDelay(index)}
						fadeInDurationInFrames={FLY_IN_CHARACTER_DURATION}
						translateY={-300}
					>
						{char === ' ' ? '\u2002' : char}
					</EnterCharacter>
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
						{char === ' ' ? '\u2002' : char}
					</span>
				))}
			</Sequence>

			{/* exit animation */}
			<Sequence
				name="WaterfallTextEffect_ExitCharacters"
				from={enterSequenceDurationInFrames + displaySequenceDurationInFrames}
				durationInFrames={exitSequenceDurationInFrames}
				layout="none"
			>
				{characters.map((char, index) => (
					<ExitCharacter
						delay={getFlyOutCharacterDelay(index)}
						fadeOutDurationInFrames={FLY_OUT_CHARACTER_DURATION}
						translateY={200}
					>
						{children}
					</ExitCharacter>
				))}
			</Sequence>
		</>
	);
};

const EnterCharacter: React.FC<{
	children: string;
	fadeInDurationInFrames: number;
	delay: number;
	translateY: number;
}> = ({children, delay, fadeInDurationInFrames, translateY}) => {
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

	const currentTranslateY = interpolate(
		frame,
		[delay, delay + fadeInDurationInFrames],
		[translateY, 0],
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
				transform: `translateY(${currentTranslateY}px)`,
				display: 'inline-block',
			}}
		>
			{children}
		</span>
	);
};

const ExitCharacter: React.FC<{
	children: string;
	fadeOutDurationInFrames: number;
	delay: number;
	translateY: number;
}> = ({children, delay, fadeOutDurationInFrames, translateY}) => {
	const frame = useCurrentFrame();

	const opacity = interpolate(
		frame,
		[delay, delay + fadeOutDurationInFrames - 1],
		[1, 0],
		{
			easing: Easing.cubic,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const currentTranslateY = interpolate(
		frame,
		[delay, delay + fadeOutDurationInFrames],
		[0, 200],
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
				transform: `translateY(${currentTranslateY}px)`,
				display: 'inline-block',
			}}
		>
			{children}
		</span>
	);
};
