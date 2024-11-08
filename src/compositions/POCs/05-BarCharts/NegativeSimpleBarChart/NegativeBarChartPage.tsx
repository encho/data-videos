import {Sequence, useVideoConfig} from 'remotion';

import {
	Page,
	PageHeader,
	PageFooter,
	PageLogo,
} from '../../03-Page/SimplePage/NewPage';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {useElementDimensions} from '../../03-Page/SimplePage/useElementDimensions';
import {
	SimpleBarChart,
	TSimpleBarChartData,
} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {TitleWithSubtitle} from '../../03-Page/TitleWithSubtitle/TitleWithSubtitle';
import {ThemeType} from '../../../../acetti-themes/themeTypes';

export const NegativeBarChartPage: React.FC<{
	theme: ThemeType;
	title: string;
	subtitle: string;
	data: TSimpleBarChartData;
	dataSource: string;
}> = ({theme, title, subtitle, data, dataSource}) => {
	const {fps} = useVideoConfig();
	const {ref, dimensions} = useElementDimensions();

	return (
		<Page theme={theme} show>
			{({baseline}) => {
				return (
					<>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								height: '100%',
								position: 'relative',
							}}
						>
							<PageHeader
								theme={theme}
								// showArea={showAreas}
							>
								<TitleWithSubtitle
									title={title}
									subtitle={subtitle}
									theme={theme}
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
									<Sequence from={Math.floor(fps * 0.75)} layout="none">
										<SimpleBarChart
											data={data}
											width={dimensions.width}
											height={dimensions.height}
											theme={theme}
											// showLayout
										/>
									</Sequence>
								) : null}
							</div>

							{/* TODO introduce evtl. also absolute positioned footer */}
							<PageFooter
								theme={theme}
								// showArea={showAreas}
							>
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
											baseline={baseline}
										>
											{dataSource}
										</TypographyStyle>
									</div>
								</div>
							</PageFooter>
						</div>
						<PageLogo theme={theme} />
					</>
				);
			}}
		</Page>
	);
};
