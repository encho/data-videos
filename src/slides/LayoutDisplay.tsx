import {AbsoluteFill} from 'remotion';

import {DisplayGridLayout, TGridLayout} from '../acetti-layout';
import {BaselineGrid} from '../acetti-typography/BaselineGrid';

export function LayoutDisplay({
	width,
	height,
	layout,
	baseline,
	hide = false,
}: {
	width: number;
	height: number;
	layout: TGridLayout;
	baseline: number;
	hide?: boolean;
}) {
	return hide ? null : (
		<>
			<AbsoluteFill>
				<BaselineGrid
					baseline={baseline}
					height={height}
					width={width}
					backgroundColor="yellow"
					baselineColor="red"
				/>
			</AbsoluteFill>
			<DisplayGridLayout
				width={layout.width}
				height={layout.height}
				areas={layout.areas}
			/>
		</>
	);
}
