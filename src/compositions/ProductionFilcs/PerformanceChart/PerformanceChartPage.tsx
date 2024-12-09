import {AbsoluteFill, useVideoConfig, Sequence} from 'remotion';

import {ThemeType} from '../../../acetti-themes/themeTypes';
import {usePage} from '../../../acetti-components/PageContext';
import {
	Page,
	PageHeader,
	PageFooter,
	PageLogo,
} from '../../../acetti-components/Page';
import {
	TNerdyFinancePriceChartDataResult,
	getSubtitle,
} from '../../../acetti-http/nerdy-finance/fetchPriceChartData';
import {TimeseriesAnimation} from './TimeseriesAnimation';
import {useElementDimensions} from '../../POCs/03-Page/SimplePage/useElementDimensions';
import {TitleWithSubtitle} from '../../POCs/03-Page/TitleWithSubtitle/TitleWithSubtitle';
import {TypographyStyle} from '../../POCs/02-TypographicLayouts/TextStyles/TextStylesComposition';
import {TextAnimationSubtle} from '../../POCs/01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';

export const PerformanceChartPage: React.FC<{
	chartTheme: ThemeType;
	apiPriceData: TNerdyFinancePriceChartDataResult;
}> = ({chartTheme, apiPriceData}) => {
	const {fps} = useVideoConfig();
	const {ref, dimensions} = useElementDimensions();
	const {theme} = usePage();

	if (!apiPriceData) {
		return <AbsoluteFill />;
	}

	const timeSeries = apiPriceData.data.map((it) => ({
		value: it.value,
		date: new Date(it.index),
	}));

	const yAxisFormatString = apiPriceData.tickerMetadata.price_format_string;

	return (
		<Page>
			<>
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
							innerDelayInSeconds={0.5}
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
							<Sequence from={Math.floor(fps * 1.75)} layout="none">
								<TimeseriesAnimation
									width={dimensions.width}
									height={dimensions.height}
									timeSeries={timeSeries}
									theme={chartTheme}
									yAxisFormatString={yAxisFormatString}
								/>
							</Sequence>
						) : null}
					</div>

					{/* TODO introduce evtl. also absolute positioned footer */}
					<PageFooter>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'flex-end',
							}}
						>
							<div style={{maxWidth: '62%'}}>
								<TypographyStyle
									typographyStyle={theme.typography.textStyles.dataSource}
								>
									<TextAnimationSubtle innerDelayInSeconds={2.5}>
										Data Source: Yahoo Finance API
									</TextAnimationSubtle>
								</TypographyStyle>
							</div>
						</div>
					</PageFooter>
				</div>
				<PageLogo />
			</>
		</Page>
	);
};
