// TODO actually this is a single Bar animation! that spans the whole area!!
// TODO rename to SingleBarAnimation
export const TwoChangeBarsComponent: React.FC<{
	height: number;
	width: number;
	currentBarHeight: number;
	valueLabelFontSize: number;
	valueLabelMarginBottom: number;
}> = ({
	height,
	width,
	currentBarHeight,
	valueLabelFontSize,
	valueLabelMarginBottom,
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
						color: 'yellow',
						fontSize: valueLabelFontSize,
						fontWeight: 600,
					}}
				>
					{/* {percentageAnimation} */}
					100%
				</div>
			</div>
		</div>
	);
};
