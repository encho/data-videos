import {Sequence, useVideoConfig} from 'remotion';

import {
	Page,
	PageHeader,
	PageFooter,
	PageLogo,
} from '../../../../acetti-components/Page';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {useElementDimensions} from '../../03-Page/SimplePage/useElementDimensions';
import {TBarChartItem} from '../../NewBarCharts/DynamicList/packages/BarChartAnimation/useBarChartTransition/useBarChartTransition';
import {TitleWithSubtitle} from '../../03-Page/TitleWithSubtitle/TitleWithSubtitle';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {SimpleBarChart} from '../../NewBarCharts/DynamicList/components/SimpleBarChart';

export const NegativeBarChartPage: React.FC<{
	theme: ThemeType;
	title: string;
	subtitle: string;
	data: TBarChartItem[];
	dataSource: string;
	valueLabelFormatter: (value: number) => string;
	// tickLabelFormatter: (value: number) => string;
}> = ({
	theme,
	title,
	subtitle,
	data,
	dataSource,
	valueLabelFormatter,
	// tickLabelFormatter,
}) => {
	const {fps} = useVideoConfig();
	const {ref, dimensions} = useElementDimensions();

	return (
		<Page>
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
							<PageHeader>
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
											hideAxis
											dataItems={data}
											width={dimensions.width}
											height={dimensions.height}
											theme={theme}
											valueLabelFormatter={valueLabelFormatter}
											// tickLabelFormatter={tickLabelFormatter}
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
											baseline={baseline}
										>
											{dataSource}
										</TypographyStyle>
									</div>
								</div>
							</PageFooter>
						</div>
						<PageLogo />
					</>
				);
			}}
		</Page>
	);
};
