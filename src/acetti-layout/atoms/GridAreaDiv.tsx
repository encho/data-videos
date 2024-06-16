import {ReactNode} from 'react';

import {TGridLayout, TGridLayoutArea} from '..';

type TGridAreaDiv = {
	layout: TGridLayout;
	area: string;
	fill?: string;
	opacity?: number;
	children?: (x: {areaWidth: number; areaHeight: number}) => ReactNode;
};

// TODO pass just TGridLayoutArea, not full layout and area name
export function GridAreaDiv({
	layout,
	area,
	fill = 'transparent',
	opacity = 1,
	children,
}: TGridAreaDiv) {
	const gridArea = layout.areas[area];
	return (
		<div style={{position: 'relative', opacity}}>
			<div
				style={{
					position: 'absolute',
					width: gridArea.width,
					height: gridArea.height,
					top: gridArea.y1,
					left: gridArea.x1,
					backgroundColor: fill,
				}}
			>
				{children &&
					children({areaHeight: gridArea.height, areaWidth: gridArea.width})}
			</div>
		</div>
	);
}

type TGridAreaDivNEW = {
	area: TGridLayoutArea;
	fill?: string;
	opacity?: number;
	children?: (x: TGridLayoutArea) => ReactNode;
};

export function GridAreaDivNEW({
	area,
	fill = 'transparent',
	opacity = 1,
	children,
}: TGridAreaDivNEW) {
	return (
		<div style={{position: 'relative', opacity}}>
			<div
				style={{
					position: 'absolute',
					width: area.width,
					height: area.height,
					top: area.y1,
					left: area.x1,
					backgroundColor: fill,
				}}
			>
				{children &&
					children({
						height: area.height,
						width: area.width,
						x1: 0,
						y1: 0,
						x2: area.width,
						y2: area.height,
					})}
			</div>
		</div>
	);
}

// // TODO deprecate the above one, just use this one
// export function GridAreaDivNEW({
// 	// layout,
// 	area,
// 	fill = 'transparent',
// 	opacity = 1,
// 	children,
// }: TGridAreaDivNEW) {
// 	// const gridArea = layout.areas[area];

// 	return (
// 		<div style={{position: 'relative', opacity}}>
// 			<div
// 				style={{
// 					position: 'absolute',
// 					width: area.width,
// 					height: area.height,
// 					top: area.y1,
// 					left: area.x1,
// 					backgroundColor: fill,
// 				}}
// 			>
// 				{children}
// 			</div>
// 		</div>
// 	);
// }
