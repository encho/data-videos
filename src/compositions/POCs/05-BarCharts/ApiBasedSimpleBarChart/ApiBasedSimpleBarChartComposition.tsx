import {z} from 'zod';

import {
	Page,
	PageHeader,
	PageFooter,
	PageLogo,
} from '../../03-Page/SimplePage/ThemePage';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {useElementDimensions} from '../../03-Page/SimplePage/useElementDimensions';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {SimpleBarChart} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {TitleWithSubtitle} from '../../03-Page/TitleWithSubtitle/TitleWithSubtitle';
import {zColor} from '@remotion/zod-types';
import {TextAnimationSubtle} from '../../01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';

export const apiBasedSimpleBarChartCompositionSchema = z.object({
	themeEnum: zThemeEnum,
	title: z.string(),
	subtitle: z.string(),
	data: z.array(
		z.object({
			label: z.string(),
			value: z.number(),
			barColor: zColor(),
			id: z.string(),
			valueLabel: z.string(),
		})
	),
});

export const ApiBasedSimpleBarChartComposition: React.FC<
	z.infer<typeof apiBasedSimpleBarChartCompositionSchema>
> = ({themeEnum, data, title, subtitle}) => {
	const theme = useThemeFromEnum(themeEnum as any);
	const {ref, dimensions} = useElementDimensions();

	return (
		<Page theme={theme}>
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
					<TitleWithSubtitle title={title} subtitle={subtitle} theme={theme} />
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
						<div>
							<SimpleBarChart
								// data={barChartData}
								data={data}
								width={dimensions.width}
								height={dimensions.height}
								// baseline={BASELINE}
								theme={theme}
								// showLayout
							/>
						</div>
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
								baseline={theme.page.baseline}
							>
								<TextAnimationSubtle
									translateY={theme.page.baseline * 1.1}
									innerDelayInSeconds={6}
								>
									Datenquelle: https://api.openligadb.de
								</TextAnimationSubtle>
							</TypographyStyle>
						</div>
					</div>
				</PageFooter>
			</div>
			<PageLogo theme={theme} />
		</Page>
	);
};
