import React from 'react';

import {HtmlArea, TGridLayoutArea} from '../../../../../../acetti-layout';
import {ThemeType} from '../../../../../../acetti-themes/themeTypes';

export const ZeroLine: React.FC<{
	area: TGridLayoutArea;
	theme: ThemeType;
	baseline: number;
	x1: number;
	x2: number;
	y1: number;
	y2: number;
}> = ({area, theme, baseline, x1, x2, y1, y2}) => {
	const zeroLine_color = theme.yAxis.color;

	return (
		<HtmlArea area={area}>
			<svg
				width={area.width}
				height={area.height}
				style={{overflow: 'visible'}}
			>
				<line
					x1={x1}
					x2={x2}
					y1={y1}
					y2={y2}
					stroke={zeroLine_color}
					strokeWidth={baseline * 0.3} // TODO from some ibcs setting
				/>
			</svg>
		</HtmlArea>
	);
};
