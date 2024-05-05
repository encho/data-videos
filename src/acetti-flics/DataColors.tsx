import {AbsoluteFill, Sequence} from 'remotion';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';

import {ThemeType} from '../acetti-themes/themeTypes';

type TDataColors = ThemeType['dataColors'];

// TODO React.FC
export const DataColors = ({
	dataColors,
	width = 500,
}: {
	// duration?: number;
	width?: number;
	dataColors: TDataColors;
}) => {
	const {durationInFrames} = useVideoConfig();

	// const waitDuration = 8;
	// const waitDuration = 20;
	const waitDuration = 10;

	const gapInPixels = 10;
	const numberOfColors = dataColors.length;
	const numberOfGaps = numberOfColors - 1;
	const boxWidthInPixels =
		(width - numberOfGaps * gapInPixels) / numberOfColors;

	return (
		<AbsoluteFill>
			<div>
				{/* <h1 style={{fontSize: 80, color: theme.xAxis.color, marginBottom: 16}}>
					DataColors
				</h1> */}
				<div
					style={{
						display: 'flex',
						gap: gapInPixels,
						justifyContent: 'space-between',
						width,
						// backgroundColor: 'blue',
					}}
				>
					{dataColors.map((dataColorObj, i) => {
						const dataColor = dataColorObj.BASE;
						const from = i * waitDuration;

						return (
							<div
								style={{
									flex: '0 0 auto',
									width: boxWidthInPixels,
									textAlign: 'center',
									// backgroundColor: 'rgba(255,255,255,0.5)',
								}}
							>
								<Sequence
									from={from}
									// from={0}
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
							</div>
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
				paddingLeft: 10,
				paddingRight: 10,
				transform: `scale(${aScale}) translateY(${aTranslateY}px) rotateX(${aRotationXDeg}deg) rotateY(${aRotationYDeg}deg) rotateZ(${aRotationZDeg}deg)`,
			}}
		>
			<div>{label}</div>
			<div>{codeHex}</div>
		</div>
	);
};
