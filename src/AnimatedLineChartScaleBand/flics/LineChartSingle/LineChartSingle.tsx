import {Sequence, useVideoConfig} from 'remotion';

import {DisplayGridLayout} from '../../../acetti-viz';
import {useChartLayout} from './useChartLayout';
import {TTheme, myTheme} from '../../theme';
import {LineChartSingleSequence} from './LineChartSingleSequence';

const Y_DOMAIN_TYPE = 'FULL';
// const Y_DOMAIN_TYPE = 'VISIBLE';

type TAnimatedLineChart2Props = {
	width: number;
	height: number;
	timeSeries: {value: number; date: Date}[];
	theme?: TTheme;
};

export const LineChartSingle: React.FC<TAnimatedLineChart2Props> = ({
	width,
	height,
	timeSeries,
	theme = myTheme,
}) => {
	const {durationInFrames} = useVideoConfig();

	const CHART_WIDTH = width;
	const CHART_HEIGHT = height;

	const chartLayout = useChartLayout({
		width: CHART_WIDTH,
		height: CHART_HEIGHT,
	});

	const FIRST_TS_START_FRAME = 0;
	const FIRST_TS_TRANSITION_IN_FRAMES = durationInFrames;

	const indicesView_1 = [0, 0] as [number, number];
	const indicesView_2 = [0, timeSeries.length] as [number, number];

	return (
		// <AbsoluteFill style={{backgroundColor: theme.global.backgroundColor}}>
		<div style={{position: 'relative'}}>
			<div style={{position: 'absolute'}}>
				<DisplayGridLayout
					stroke={'#f05122'}
					fill="transparent"
					hide={true}
					// hide={false}
					areas={chartLayout.areas}
					width={width}
					height={height}
				/>
			</div>
			{/* Hello */}
			<Sequence
				from={FIRST_TS_START_FRAME}
				durationInFrames={FIRST_TS_TRANSITION_IN_FRAMES}
				layout="none"
			>
				<LineChartSingleSequence
					timeSeries={timeSeries}
					fromVisibleDomainIndices={indicesView_1}
					toVisibleDomainIndices={indicesView_2}
					layoutAreas={{
						plot: chartLayout.areas.plot,
						xAxis: chartLayout.areas.xAxis,
						yAxis: chartLayout.areas.yAxis,
					}}
					yDomainType={Y_DOMAIN_TYPE}
					theme={theme}
				/>
			</Sequence>
		</div>
		// </AbsoluteFill>
	);
};
