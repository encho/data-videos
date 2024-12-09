import {
	Easing,
	AbsoluteFill,
	useVideoConfig,
	Sequence,
	useCurrentFrame,
	interpolate,
} from 'remotion';
import {format} from 'date-fns';
import {enGB} from 'date-fns/locale';

import {usePage} from '../../../acetti-components/PageContext';
import {Page, PageHeader} from '../../../acetti-components/Page';
import {TNerdyFinancePriceChartDataResult} from '../../../acetti-http/nerdy-finance/fetchPriceChartData';
import {TimeseriesAnimation} from './TimeseriesAnimation';
import {useElementDimensions} from '../../POCs/03-Page/SimplePage/useElementDimensions';
import {TitleWithSubtitle} from '../../POCs/03-Page/TitleWithSubtitle/TitleWithSubtitle';

const formatDate = (date: Date): string => {
	return format(date, 'P', {locale: enGB}); // Formats to '1. Jan. 2024'
};

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

	const getSubtitle = (
		nerdyPriceApiResult: TNerdyFinancePriceChartDataResult
	) => {
		const startDate = nerdyPriceApiResult.data[0].index;
		const endDate =
			nerdyPriceApiResult.data[nerdyPriceApiResult.data.length - 1].index;
		const periodString = `(${formatDate(startDate)}-${formatDate(endDate)})`;

		if (nerdyPriceApiResult.timePeriod === '2Y') {
			return `2-Year Performance ${periodString}`;
		}

		return 'Implement subtitle for this timePeriod!!!';
	};

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
							/>
						</Sequence>
					) : null}
				</div>
			</div>
		</Page>
	);
};
