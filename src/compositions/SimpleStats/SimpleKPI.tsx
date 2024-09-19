import {z} from 'zod';
import numeral from 'numeral';
import {
	Sequence,
	useVideoConfig,
	Easing,
	useCurrentFrame,
	interpolate,
} from 'remotion';

import {Position} from '../../acetti-ts-base/Position';
import LorenzoBertoliniLogo from '../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../acetti-themes/getThemeFromEnum';

export const simpleKPICompositionSchema = z.object({
	themeEnum: zThemeEnum,
	kpiValue: z.number(),
	kpiValueFormatString: z.string(),
	kpiLabel: z.string(),
	fontSize: z.number(),
});

export const SimpleKPIComposition: React.FC<
	z.infer<typeof simpleKPICompositionSchema>
> = ({themeEnum, kpiValue, kpiValueFormatString, kpiLabel, fontSize}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	const formattedKpiValue = numeral(kpiValue).format(kpiValueFormatString);

	const kpiColor = theme.typography.textColor;

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<Position position={{top: 100, left: 100}}>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						fontSize,
					}}
				>
					<div
						style={{
							fontSize,
							fontWeight: 700,
							fontFamily: 'Arial',
							color: kpiColor,
						}}
					>
						<AnimateText>{formattedKpiValue}</AnimateText>
					</div>
					<div
						style={{
							color: 'gray',
							fontFamily: 'Arial',
							fontSize: `${0.62}em`,
							fontWeight: 500,
							marginTop: `-${0.5}em`,
						}}
					>
						<AnimateText>{kpiLabel}</AnimateText>
					</div>
				</div>
			</Position>
			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};

const AnimateText: React.FC<{children: string}> = ({children}) => {
	const {durationInFrames} = useVideoConfig();

	const characters = children.split('');

	const enterSequenceDurationInFrames = 150;
	const exitSequenceDurationInFrames = 120;
	const displaySequenceDurationInFrames =
		durationInFrames -
		enterSequenceDurationInFrames -
		exitSequenceDurationInFrames;

	return (
		<>
			{/* enter animation */}
			<Sequence durationInFrames={enterSequenceDurationInFrames} layout="none">
				{characters.map((char, index) => (
					<FadeInCharacter delay={index * 5} fadeInDurationInFrames={30}>
						{char}
					</FadeInCharacter>
				))}
			</Sequence>
			{/* display */}
			<Sequence
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
