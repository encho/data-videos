import {range} from 'lodash';

// import type {Theme} from '../theme';

type TBaselineGridProps = {
	baseline: number;
	width: number;
	height: number;
	// theme: Theme;
	backgroundColor: string;
	baselineColor: string;
};

export function BaselineGrid({
	baseline,
	width,
	height,
	// theme,
	backgroundColor,
	baselineColor,
}: TBaselineGridProps) {
	// const backgroundColor = theme.BaselineGrid.backgroundColor;
	// const baselineColor = theme.BaselineGrid.baselineColor;

	return (
		<div style={{position: 'relative', backgroundColor: 'transparent'}}>
			<svg width={width} height={height} style={{backgroundColor}}>
				{range(baseline, height, baseline).map((yPosition, i) => {
					return (
						<line
							key={i}
							y1={yPosition}
							y2={yPosition}
							x1={0}
							x2={width}
							stroke={baselineColor}
							strokeWidth={2}
						/>
					);
				})}
				<text>{baseline}</text>
			</svg>
		</div>
	);
}
