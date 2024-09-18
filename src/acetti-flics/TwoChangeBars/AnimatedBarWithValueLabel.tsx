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
	formatter: (x: number) => string;
	displayTrimmer?: boolean;
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
}) => {
	const currentBarHeightInPixels = currentBarHeight;

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
				<rect
					y={height - currentBarHeightInPixels}
					x={0}
					height={currentBarHeightInPixels}
					width={width}
					fill={barColor}
					rx={3}
					ry={3}
					// fill={'yellow'}
					// rx={10}
					// ry={10}
				/>
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
