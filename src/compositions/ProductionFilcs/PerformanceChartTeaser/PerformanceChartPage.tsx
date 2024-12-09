import {
	Easing,
	AbsoluteFill,
	useVideoConfig,
	Sequence,
	useCurrentFrame,
	interpolate,
} from 'remotion';

import {usePage} from '../../../acetti-components/PageContext';
import {Page, PageHeader} from '../../../acetti-components/Page';
import {TNerdyFinancePriceChartDataResult} from '../../../acetti-http/nerdy-finance/fetchPriceChartData';
import {TimeseriesAnimation} from './TimeseriesAnimation';
import {useElementDimensions} from '../../POCs/03-Page/SimplePage/useElementDimensions';
import {TitleWithSubtitle} from '../../POCs/03-Page/TitleWithSubtitle/TitleWithSubtitle';
import {
	getSubtitle,
	getTickLabelFormatter,
} from '../../../acetti-http/nerdy-finance/fetchPriceChartData';

export const PerformanceChartPage: React.FC<{
	apiPriceData: TNerdyFinancePriceChartDataResult;
	lineColor: string;
}> = ({apiPriceData, lineColor}) => {
	const {fps, durationInFrames} = useVideoConfig();
	const {ref, dimensions} = useElementDimensions();
	const {theme} = usePage();
	const frame = useCurrentFrame();

	const opacity = interpolate(
		frame,
		[durationInFrames - Math.floor(fps * 0.8), durationInFrames - 1],
		[1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.ease}
	);

	if (!apiPriceData) {
		return <AbsoluteFill />;
	}

	const timeSeries = apiPriceData.data.map((it) => ({
		value: it.value,
		date: new Date(it.index),
	}));

	return (
		<Page boxShadow borderRadius={20} opacity={opacity}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
					position: 'relative',
				}}
			>
				<PageHeader>
					<TitleWithSubtitle
						title={apiPriceData.tickerMetadata.name}
						subtitle={getSubtitle(apiPriceData)}
						theme={theme}
						innerDelayInSeconds={0}
						subtitleInnerDelayInSeconds={0}
						animateEnter={false}
						animateExit={false}
					/>
				</PageHeader>

				<div
					ref={ref}
					style={{
						flex: 1,
						display: 'flex',
						justifyContent: 'center',
					}}
				>
					{dimensions ? (
						<Sequence from={Math.floor(fps * 0)} layout="none">
							<TimeseriesAnimation
								lineColor={lineColor}
								width={dimensions.width}
								height={dimensions.height}
								timeSeries={timeSeries}
								theme={theme}
								yTickLabelFormatter={getTickLabelFormatter(apiPriceData)}
							/>
						</Sequence>
					) : null}
				</div>
			</div>
		</Page>
	);
};
