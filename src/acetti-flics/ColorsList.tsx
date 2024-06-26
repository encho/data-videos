import {Sequence} from 'remotion';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import chroma from 'chroma-js';

// TODO integrate in flics with zod...
type TColorsListItem = {
	label: string;
	// TODO zod Color Type?
	color: string;
};
type TColorsList = TColorsListItem[];

// TODO React.FC
export const ColorsList = ({
	colorsList,
	width = 500,
	noLabel = false,
	textColorMain,
	textColorContrast,
}: {
	width?: number;
	colorsList: TColorsList;
	noLabel?: boolean;
	textColorMain: string;
	textColorContrast: string;
}) => {
	const {durationInFrames} = useVideoConfig();

	// const waitDuration = 8;
	// const waitDuration = 20;
	const waitDuration = 10;

	const gapInPixels = 10;
	const numberOfColors = colorsList.length;
	const numberOfGaps = numberOfColors - 1;
	const boxWidthInPixels =
		(width - numberOfGaps * gapInPixels) / numberOfColors;

	return (
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
				{colorsList.map((colorItem, i) => {
					const dataColor = colorItem.color;
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
									label={colorItem.label}
									codeHex={dataColor}
									noLabel={noLabel}
									textColorMain={textColorMain}
									textColorContrast={textColorContrast}
								/>
							</Sequence>
						</div>
					);
				})}
			</div>
		</div>
	);
};

const ColorItem = ({
	color,
	label,
	codeHex,
	noLabel,
	textColorMain,
	textColorContrast,
}: {
	color: string;
	label: string;
	codeHex: string;
	noLabel: boolean;
	textColorMain: string;
	textColorContrast: string;
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

	const contrastTextColorMain = chroma.contrast(textColorMain, codeHex);
	const contrastTextColorContrast = chroma.contrast(textColorContrast, codeHex);

	const textColor =
		contrastTextColorMain > contrastTextColorContrast
			? textColorMain
			: textColorContrast;

	return (
		<div
			style={{
				opacity: aOpacity,
				backgroundColor: color,
				borderRadius: 10,
				paddingTop: 10,
				paddingBottom: 10,
				paddingLeft: 10,
				paddingRight: 10,
				transform: `scale(${aScale}) translateY(${aTranslateY}px) rotateX(${aRotationXDeg}deg) rotateY(${aRotationYDeg}deg) rotateZ(${aRotationZDeg}deg)`,
			}}
		>
			{noLabel ? null : <div>{label}</div>}
			<div style={{color: textColor}}>{codeHex}</div>
		</div>
	);
};
