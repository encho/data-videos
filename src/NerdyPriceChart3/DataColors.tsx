import {AbsoluteFill, Sequence} from 'remotion';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {lorenzobertoliniTheme} from '../acetti-themes/lorenzobertolini';
// import {nerdyTheme} from './themes/nerdy';

// TODO React.FC
// todo pass datacolors object
export const DataColors = ({duration = 200}: {duration?: number}) => {
	const {durationInFrames} = useVideoConfig();
	// const theme = themeEnum === 'NERDY' ? nerdyTheme : lorenzobertoliniTheme;
	// const theme = nerdyTheme;
	const theme = lorenzobertoliniTheme;

	const waitDuration = 8;

	return (
		<AbsoluteFill>
			<div>
				<h1 style={{fontSize: 80, color: theme.xAxis.color, marginBottom: 16}}>
					DataColors
				</h1>
				<div style={{display: 'flex', gap: 20}}>
					{theme.dataColors.map((dataColorObj, i) => {
						const dataColor = dataColorObj.BASE;
						const from = i * waitDuration;

						return (
							<Sequence
								from={from}
								durationInFrames={durationInFrames - from}
								layout="none"
							>
								{/* TODO
								<ColorItemSequence
								from={}
								durationInFrames={}
								enterDurationInFrames={}
									color={dataColor}
									label={`dataColor${i}`}
									codeHex={dataColor}
								/> */}
								<ColorItem
									// enterDuratonInFrames={20}
									color={dataColor}
									label={`dataColor${i}`}
									codeHex={dataColor}
								/>
							</Sequence>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};

const ColorItem = ({
	color,
	label,
	codeHex,
}: // enterDurationInFrames,
{
	color: string;
	label: string;
	codeHex: string;
	// enterDurationInFrames: number;
}) => {
	const frame = useCurrentFrame();
	const enterDurationInFrames = 200;
	const {durationInFrames} = useVideoConfig();

	const aPerc = interpolate(
		frame,
		[0, enterDurationInFrames, durationInFrames],
		[0, 1, 1]
	);

	const aOpacity = interpolate(aPerc, [0, 0.1, 1], [0, 1, 1]);

	const aRotationXDeg = interpolate(aPerc, [0, 0.15, 1], [3, 0, 0]);
	const aRotationYDeg = interpolate(aPerc, [0, 0.15, 1], [3, 0, 0]);
	const aRotationZDeg = aRotationXDeg;

	const aTranslateY = interpolate(aPerc, [0, 0.07, 1], [10, 0, 0]);

	const aScale = interpolate(aPerc, [0, 0.2, 1], [1.2, 1, 1]);

	return (
		<div
			style={{
				opacity: aOpacity,
				backgroundColor: color,
				borderRadius: 10,
				paddingTop: 30,
				paddingBottom: 30,
				paddingLeft: 40,
				paddingRight: 40,
				transform: `scale(${aScale}) translateY(${aTranslateY}px) rotateX(${aRotationXDeg}deg) rotateY(${aRotationYDeg}deg) rotateZ(${aRotationZDeg}deg)`,
			}}
		>
			<div>{label}</div>
			<div>{codeHex}</div>
		</div>
	);
};
