// import {toPairs} from 'lodash';
import {
	// TGridLayoutArea,
	TGridLayout,
} from '../types2';
// import Area from './Area';
import Svg from './Svg';
// import Title from './Title';

type TDisplayGridRailsProps = TGridLayout & {
	// width: number;
	// height: number;
	// areas: {[k: string]: TGridLayoutArea};
	// hide?: boolean;
	// fill?: string;
	// stroke?: string;
};

export default function DisplayGridRails({
	width,
	height,
	rows,
	columns,
	areas,
}: TDisplayGridRailsProps) {
	const strokeColor = 'magenta';
	const fillColor = 'rgba(255,0,0,0.2)';

	console.log({rows, columns});

	return (
		<div style={{position: 'relative'}}>
			<Svg width={width} height={height} stroke={strokeColor} fill={fillColor}>
				{rows.map((row) => {
					return (
						<rect
							x={0}
							y={row.start}
							height={row.end - row.start}
							width={width}
							stroke={'orange'}
							fill={'rgba(100,50,0,0.2)'}
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
							stroke={'orange'}
							fill={'rgba(100,50,0,0.2)'}
						/>
					);
				})}
			</Svg>
		</div>
	);
}
