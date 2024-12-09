import {useVideoConfig, Sequence} from 'remotion';
// import {format} from 'date-fns';
// import {enGB} from 'date-fns/locale';

import {TimeSeries} from '../../../acetti-ts-utils/timeSeries/timeSeries';
import {ThemeType} from '../../../acetti-themes/themeTypes';
import {usePage} from '../../../acetti-components/PageContext';
import {
	Page,
	PageHeader,
	PageFooter,
	PageLogo,
} from '../../../acetti-components/Page';
import {TimeseriesAnimation} from './TimeseriesAnimation';
import {useElementDimensions} from '../../POCs/03-Page/SimplePage/useElementDimensions';
import {TitleWithSubtitle} from '../../POCs/03-Page/TitleWithSubtitle/TitleWithSubtitle';
import {TypographyStyle} from '../../POCs/02-TypographicLayouts/TextStyles/TextStylesComposition';
import {TextAnimationSubtle} from '../../POCs/01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';

// const formatDate = (date: Date): string => {
// 	return format(date, 'P', {locale: enGB}); // Formats to '1. Jan. 2024'
// };

export const PerformanceCompareChartPage: React.FC<{
	chartTheme: ThemeType;
	timeSeries1: TimeSeries;
	timeSeries2: TimeSeries;
	// metaInfo...
}> = ({chartTheme, timeSeries1, timeSeries2}) => {
	const {fps} = useVideoConfig();
	const {ref, dimensions} = useElementDimensions();
	const {theme} = usePage();

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
							// title={apiPriceData.tickerMetadata.name}
							// subtitle={getSubtitle(apiPriceData)}
							title="hehehehe"
							subtitle="heheheeheh2222"
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
									timeSeries1={timeSeries1}
									timeSeries2={timeSeries2}
									theme={chartTheme}
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
