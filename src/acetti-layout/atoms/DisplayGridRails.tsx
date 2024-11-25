import {TGridLayout} from '../types2';
import Svg from './Svg';
// import { ThemeType } from '../../acetti-themes/themeTypes';

type TDisplayGridRailsProps = TGridLayout & {
	stroke?: string;
	strokeWidth?: number;
};

export default function DisplayGridRails({
	width,
	height,
	rows,
	columns,
	// areas,
	stroke = 'rgba(255,0,255,0.3)',
	strokeWidth = 3,
}: TDisplayGridRailsProps) {
	return (
		<div style={{position: 'relative'}}>
			<Svg width={width} height={height} stroke={stroke} fill="transparent">
				{rows.map((row) => {
					return (
						<rect
							key={row.name + row.positionOfType}
							x={0}
							y={row.start}
							height={row.end - row.start}
							width={width}
							stroke={stroke}
							strokeWidth={strokeWidth}
							fill="transparent"
						/>
					);
				})}
				{columns.map((column) => {
					return (
						<rect
							key={column.name + column.positionOfType}
							x={column.start}
							y={0}
							height={height}
							width={column.end - column.start}
							stroke={stroke}
							strokeWidth={strokeWidth}
							fill="transparent"
						/>
					);
				})}
			</Svg>
		</div>
	);
}
