import {useCurrentFrame, useVideoConfig, spring} from 'remotion';

// TODO actually this is a single Bar animation! that spans the whole area!!
// TODO rename to SingleBarAnimation
export const TwoChangeBarsComponent: React.FC<{
	height: number;
	width: number;
	// startValue: number;
	endValuePerc: number;
}> = ({height, width, endValuePerc}) => {
	const frame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();

	const spr = spring({
		fps,
		frame,
		config: {damping: 300},
		durationInFrames: durationInFrames / 2,
	});

	const percentageAnimation = spr;

	// end value in percentage of height
	// const endValueInPercOfHeight = 0.8;
	const endValueInPercOfHeight = endValuePerc;

	// const startBarHeightInPixels = 0;
	const endBarHeightInPixels = height * endValueInPercOfHeight;

	const currentBarHeightInPixels = endBarHeightInPixels * percentageAnimation;

	return (
		<div style={{backgroundColor: 'cyan', width, height, position: 'relative'}}>
			<div
				style={{position: 'absolute', top: height - currentBarHeightInPixels}}
			>
				<div
					style={{
						height: currentBarHeightInPixels,
						width,
						backgroundColor: 'yellow',
					}}
				/>
			</div>
		</div>
	);
};
