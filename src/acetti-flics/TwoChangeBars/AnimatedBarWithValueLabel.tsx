import {line, curveLinearClosed} from 'd3-shape';
import {interpolate} from 'remotion';

// TODO actually this is a single Bar animation! that spans the whole area!!
// TODO rename to SingleBarAnimation
export const AnimatedBarWithValueLabel: React.FC<{
	height: number;
	width: number;
	currentBarValue: number;
	currentBarHeight: number;
	valueLabelFontSize: number;
	valueLabelMarginBottom: number;
	barColor: string;
	valueLabelColor: string;
	backgroundColor: string;
	formatter: (x: number) => string;
	displayTrimmer?: boolean;
	displayTrimmerAnimationPerc: number;
}> = ({
	height,
	width,
	currentBarValue,
	currentBarHeight,
	valueLabelFontSize,
	valueLabelMarginBottom,
	barColor,
	valueLabelColor,
	formatter,
	displayTrimmer,
	displayTrimmerAnimationPerc,
	backgroundColor,
}) => {
	const currentBarHeightInPixels = currentBarHeight;

	const trimmerLeftAnsatz = 60;
	const trimmerSteigungInPixels = 40;
	const trimmerRightAnsatz = trimmerLeftAnsatz + trimmerSteigungInPixels;
	const trimmerLeftCentroidY = height - trimmerLeftAnsatz;
	const trimmerRightCentroidY = trimmerLeftCentroidY - trimmerSteigungInPixels;

	const trimmerHeight = 10;

	const trimmerPoints = [
		{x: 0, y: trimmerLeftCentroidY + trimmerHeight / 2},
		{x: 0, y: trimmerLeftCentroidY - trimmerHeight / 2},
		{x: width, y: trimmerRightCentroidY - trimmerHeight / 2},
		{x: width, y: trimmerRightCentroidY + trimmerHeight / 2},
	];

	// Create a line generator with closed path
	const lineGenerator = line<{x: number; y: number}>()
		.x((d) => d.x)
		.y((d) => d.y)
		.curve(curveLinearClosed); // This ensures the path will close

	// Generate the path data
	const pathData = lineGenerator(trimmerPoints) || '';

	const pathShift = interpolate(
		displayTrimmerAnimationPerc || 0,
		[0.2, 0.8],
		[trimmerRightAnsatz + 20, 0],
		{
			extrapolateRight: 'clamp',
			extrapolateLeft: 'clamp',
		}
	);

	// const pathColor = 'cyan';
	const pathColor = backgroundColor;

	return (
		<div
			style={{
				width,
				height,
				position: 'relative',
			}}
		>
			<svg
				style={{
					width,
					height,
					overflow: 'visible',
				}}
			>
				<mask id="barMask">
					<rect
						y={0}
						x={0}
						height={height}
						width={width}
						rx={3}
						ry={3}
						fill="white"
					/>
				</mask>

				<rect
					y={height - currentBarHeightInPixels}
					x={0}
					height={currentBarHeightInPixels}
					width={width}
					fill={barColor}
					rx={3}
					ry={3}
				/>

				{displayTrimmer ? (
					<g mask="url(#barMask)">
						{/* trimmer */}
						<g transform={`translate(${0}, ${pathShift})`}>
							<path
								d={pathData}
								// fill={backgroundColor}
								fill={pathColor}
							/>
						</g>
					</g>
				) : null}
			</svg>

			{/* TODO solve outside this component, with help of bars height knowledge */}
			{/* value label */}
			<div
				style={{
					position: 'absolute',
					top:
						height -
						currentBarHeightInPixels -
						valueLabelFontSize -
						valueLabelMarginBottom -
						// heuristic margin adjustment factor to center text vertically in its box (QUICK FIX FOR CAPSIZE)
						(15 * valueLabelFontSize) / 50,
					//
					width,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<div
					style={{
						color: valueLabelColor,
						fontSize: valueLabelFontSize,
						fontWeight: 600,
					}}
				>
					{formatter(currentBarValue)}
				</div>
			</div>
		</div>
	);
};
