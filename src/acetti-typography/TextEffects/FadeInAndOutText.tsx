import {
	Sequence,
	useVideoConfig,
	Easing,
	useCurrentFrame,
	interpolate,
} from 'remotion';

import {ThemeType} from '../../acetti-themes/themeTypes';

// TODO introduce a delay prop, where we render with opacity=0, to respect the layout in KPI
export const FadeInAndOutText: React.FC<{
	children: string;
	innerDelay?: number;
	enterDurationInFrames?: number;
}> = ({children, innerDelay = 0, enterDurationInFrames = 120}) => {
	const {durationInFrames} = useVideoConfig();

	const characters = children.split('');

	let exitSequenceDurationInFrames = 200;
	let displaySequenceDurationInFrames =
		durationInFrames -
		innerDelay -
		enterDurationInFrames -
		exitSequenceDurationInFrames;

	if (displaySequenceDurationInFrames < 0) {
		exitSequenceDurationInFrames =
			exitSequenceDurationInFrames + displaySequenceDurationInFrames - 1;
		displaySequenceDurationInFrames = 1;
	}

	const entryDelay = innerDelay;
	const displayDelay = entryDelay + enterDurationInFrames;
	const exitDelay = displayDelay + displaySequenceDurationInFrames;

	return (
		<>
			{innerDelay ? (
				<Sequence
					name="FadeInAndOutText_InnerDelay"
					durationInFrames={innerDelay}
					layout="none"
				>
					{characters.map((char) => (
						<span
							style={{
								visibility: 'hidden',
							}}
						>
							{char}
						</span>
					))}
				</Sequence>
			) : null}

			{/* enter animation */}
			<Sequence
				name="FadeInAndOutText_FadeInCharacters"
				durationInFrames={enterDurationInFrames}
				from={entryDelay}
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
				from={displayDelay}
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
				from={exitDelay}
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
