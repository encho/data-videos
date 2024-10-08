import {TGridLayout} from '../types2';
import Svg from './Svg';

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
	stroke = 'red',
	strokeWidth = 3,
}: TDisplayGridRailsProps) {
	return (
		<div style={{position: 'relative'}}>
			<Svg width={width} height={height} stroke={stroke} fill="transparent">
				{rows.map((row) => {
					return (
						<rect
							x={0}
							y={row.start}
							height={row.end - row.start}
							width={width}
							stroke={stroke}
							strokeWidth={strokeWidth}
							fill={'transparent'}
						/>
					);
				})}
				{columns.map((column) => {
					return (
						<rect
							x={column.start}
							y={0}
							height={height}
							width={column.end - column.start}
							stroke={stroke}
							strokeWidth={strokeWidth}
							fill={'transparent'}
						/>
					);
				})}
			</Svg>
		</div>
	);
}
