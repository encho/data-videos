import {useVideoConfig, Sequence} from 'remotion';
import {format} from 'date-fns';
import {enGB} from 'date-fns/locale';

import {TimeSeries} from '../../../acetti-ts-utils/timeSeries/timeSeries';
import {ThemeType} from '../../../acetti-themes/themeTypes';
import {usePage} from '../../../acetti-components/PageContext';
import {Page, PageHeader, PageFooter} from '../../../acetti-components/Page';
import {TimeseriesAnimation} from './TimeseriesAnimation';
import {useElementDimensions} from '../../POCs/03-Page/SimplePage/useElementDimensions';
import {TitleWithSubtitle} from '../../POCs/03-Page/TitleWithSubtitle/TitleWithSubtitle';
import {TypographyStyle} from '../../POCs/02-TypographicLayouts/TextStyles/TextStylesComposition';
import {TextAnimationSubtle} from '../../POCs/01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';
import {TNerdyFinance_strategyInfo} from '../../../acetti-http/nerdy-finance/types/nerdyFinance_types_strategyInfo';

const formatDate = (date: Date): string => {
	return format(date, 'd MMM yyyy', {locale: enGB}); // Formats to '1. Jan. 2024'
};

export const BacktestChartPage: React.FC<{
	chartTheme: ThemeType;
	strategyInfo: TNerdyFinance_strategyInfo;
	strategyTotalValueTimeseries: TimeSeries;
}> = ({chartTheme, strategyInfo, strategyTotalValueTimeseries}) => {
	const {fps} = useVideoConfig();
	const {ref, dimensions} = useElementDimensions();
	const {theme} = usePage();
	const timeSeries = strategyTotalValueTimeseries;

	const getSubtitle = (ts: TimeSeries) => {
		const startDate = ts[0].date;
		const endDate = ts[ts.length - 1].date;

		return `Growth of $10,000 (${formatDate(startDate)} – ${formatDate(
			endDate
		)})`;
	};

	const title = strategyInfo.name + ' Performance';
	const subtitle = getSubtitle(strategyTotalValueTimeseries);

	return (
		<Page>
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
						title={title}
						subtitle={subtitle}
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
									Data Source: Yahoo Finance API, own calculations
								</TextAnimationSubtle>
							</TypographyStyle>
						</div>
					</div>
				</PageFooter>
			</div>
		</Page>
	);
};
