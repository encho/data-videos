import {AbsoluteFill} from 'remotion';
import {TGridLayoutArea} from '../acetti-viz';

// ****************************************************************

export const LineChart: React.FC<{
	area: TGridLayoutArea;
}> = ({area}) => {
	return (
		<AbsoluteFill
		// style={{backgroundColor}}
		>
			<div
				style={{
					position: 'absolute',
					top: area.y1,
					left: area.x1,
				}}
			>
				<svg
					overflow="visible"
					width={area.width}
					height={area.height}
					style={{backgroundColor: '#222'}}
				></svg>
			</div>
		</AbsoluteFill>
	);
};
