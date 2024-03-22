import {AbsoluteFill} from 'remotion';
import {TimeSeries} from './generateBrownianMotionTimeSeries';
import {TGridLayoutArea} from '../acetti-viz';
import {getXAxisSpec} from '../acetti-axis/getXAxisSpec';

import {Transition_HorizontalDateAxis_Line} from './Transition_HorizontalDateAxis_Line';
import {Transition_HorizontalDateAxis_Labels} from './Transition_HorizontalDateAxis_Labels';
import {Transition_HorizontalDateAxis_Ticks} from './Transition_HorizontalDateAxis_Ticks';

// TODO integrate
// const TICK_SIZE = 50;
// const TICK_LABEL_MARGIN = 0;
// const TEXT_COLOR = '#f05122';

// TODO define type for props

export const Transition_HorizontalDateAxis: React.FC<{
	startTimeSeries: TimeSeries;
	endTimeSeries: TimeSeries;
	backgroundColor: string;
	area: TGridLayoutArea;
	// styles
	textColor: string;
	tickSize?: number;
	tickLabelMargin?: number;
}> = ({
	startTimeSeries,
	endTimeSeries,
	backgroundColor,
	textColor,
	area,
	tickSize = 10,
	tickLabelMargin = 0,
}) => {
	const axisStart = getXAxisSpec(
		startTimeSeries.map((it) => it.date),
		area,
		'STANDARD'
		// 'INTER_MONTHS'
	);
	const axisEnd = getXAxisSpec(
		endTimeSeries.map((it) => it.date),
		area,
		'STANDARD'
		// 'INTER_MONTHS'
	);

	return (
		<AbsoluteFill>
			{/* TODO  */}
			{/* <Position top={area.y1} left={area.x1} />{...} */}
			<div
				style={{
					position: 'absolute',
					top: area.y1,
					left: area.x1,
				}}
			>
				<svg overflow="visible" width={1080} height={100}>
					<g>
						<Transition_HorizontalDateAxis_Ticks
							from={axisStart}
							to={axisEnd}
							tickColor={textColor}
						/>
						<Transition_HorizontalDateAxis_Labels
							from={axisStart}
							to={axisEnd}
							labelColor={textColor}
						/>
						<Transition_HorizontalDateAxis_Line
							from={axisStart}
							to={axisEnd}
							lineColor={textColor}
						/>
					</g>
				</svg>
			</div>
		</AbsoluteFill>
	);
};
