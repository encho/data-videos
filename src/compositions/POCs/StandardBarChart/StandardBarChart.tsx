import {z} from 'zod';

import LorenzoBertoliniLogo from '../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../acetti-themes/getThemeFromEnum';
import {
	DisplayGridLayout,
	DisplayGridRails,
	Area,
} from '../../../acetti-layout';

import {useChartLayout, getMatrixLayoutCellArea} from './useChartLayout';

export const standardBarChartSchema = z.object({
	themeEnum: zThemeEnum,
});

const LAYOUT_WIDTH = 800;
const LAYOUT_HEIGHT = 600;

export const StandardBarChart: React.FC<
	z.infer<typeof standardBarChartSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	const chartLayout = useChartLayout({
		width: LAYOUT_WIDTH,
		height: LAYOUT_HEIGHT,
		nrColumns: 5,
		nrRows: 4,
	});

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<div
				style={{
					color: theme.typography.title.color,
					fontSize: 50,
					marginBottom: 50,
				}}
			>
				Standard BarChart (or new Layout MAtrix accessors...)
			</div>

			{/* <DisplayGridLayout
				width={chartLayout.width}
				height={chartLayout.height}
				areas={chartLayout.areas}
			/> */}

			<div style={{position: 'relative'}}>
				{/* TODO to better also with dots, rails as e.g. axes more high quality... envisioning typography tutorial videos */}
				<DisplayGridRails {...chartLayout} />
				<div style={{position: 'absolute', top: 0, left: 0}}>
					<svg
						style={{
							width: chartLayout.width,
							height: chartLayout.height,
							// backgroundColor: 'rgba(255,0,0,0.2)',
						}}
					>
						<Area
							area={getMatrixLayoutCellArea(chartLayout, 'cell', 0, 0)}
							fill="rgba(200,100,0,0.6)"
						>
							<g></g>
						</Area>
						<Area
							area={getMatrixLayoutCellArea(chartLayout, 'cell', 1, 0)}
							fill="rgba(200,100,0,0.6)"
						>
							<g></g>
						</Area>
						<Area
							area={getMatrixLayoutCellArea(chartLayout, 'cell', 2, 0)}
							fill="rgba(200,100,0,0.6)"
						>
							<g></g>
						</Area>
						<Area
							area={getMatrixLayoutCellArea(chartLayout, 'cell', 3, 0)}
							fill="rgba(200,100,0,0.6)"
						>
							<g></g>
						</Area>
						{/* // */}
						<Area
							area={getMatrixLayoutCellArea(chartLayout, 'cell', 0, 1)}
							fill="rgba(200,100,0,0.6)"
						>
							<g></g>
						</Area>
						<Area
							area={getMatrixLayoutCellArea(chartLayout, 'cell', 1, 1)}
							fill="rgba(200,100,0,0.6)"
						>
							<g></g>
						</Area>
						<Area
							area={getMatrixLayoutCellArea(chartLayout, 'cell', 2, 1)}
							fill="rgba(200,100,0,0.6)"
						>
							<g></g>
						</Area>
						<Area
							area={getMatrixLayoutCellArea(chartLayout, 'cell', 3, 1)}
							fill="rgba(200,100,0,0.6)"
						>
							<g></g>
						</Area>
					</svg>
				</div>
			</div>

			{/* <svg
				style={{
					width: LAYOUT_WIDTH,
					height: LAYOUT_HEIGHT,
					backgroundColor: '#444',
				}}
			>
				<g></g>
			</svg> */}

			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};
