import {AbsoluteFill} from 'remotion';

import {DisplayGridLayout, TGridLayout} from '../acetti-viz';
import {BaselineGrid} from './BaselineGrid';

// import type {Theme} from '../theme';

export function LayoutDisplay({
	width,
	height,
	layout,
	baseline,
	hide = false,
}: // theme,
{
	width: number;
	height: number;
	layout: TGridLayout;
	baseline: number;
	hide?: boolean;
	// theme: Theme;
}) {
	return !hide ? (
		// return false ? (
		<>
			<AbsoluteFill>
				<BaselineGrid
					baseline={baseline}
					height={height}
					width={width}
					backgroundColor={'yellow'}
					baselineColor={'red'}
					// theme={theme}
				/>
			</AbsoluteFill>
			<DisplayGridLayout
				width={layout.width}
				height={layout.height}
				areas={layout.areas}
			/>
		</>
	) : null;
}
