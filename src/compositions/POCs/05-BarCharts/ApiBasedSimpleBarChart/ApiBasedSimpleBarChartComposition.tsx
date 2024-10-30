import {z} from 'zod';
import {useVideoConfig, Img} from 'remotion';

import {useBarChartKeyframes} from '../../../../acetti-flics/SimpleBarChart/useBarChartKeyframes';
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
import {getBarChartBaseline} from '../../../../acetti-flics/SimpleBarChart/useBarChartLayout';
import invariant from 'tiny-invariant';

export const apiBasedSimpleBarChartCompositionSchema = z.object({
	themeEnum: zThemeEnum,
	title: z.string(),
	subtitle: z.string(),
	dataSource: z.string(),
	data: z.array(
		z.object({
			label: z.string(),
			value: z.number(),
			barColor: zColor(),
			id: z.string(),
			valueLabel: z.string(),
			teamIconUrl: z.string(),
		})
	),
});

export const ApiBasedSimpleBarChartComposition: React.FC<
	z.infer<typeof apiBasedSimpleBarChartCompositionSchema>
> = ({themeEnum, data, title, subtitle, dataSource}) => {
	const {fps, durationInFrames} = useVideoConfig();
	const theme = useThemeFromEnum(themeEnum as any);
	const {ref, dimensions} = useElementDimensions();

	const keyframes = useBarChartKeyframes({
		fps,
		durationInFrames,
		data,
	});

	const enterEndKeyframes = keyframes.keyFrames.filter((it) =>
		it.id.includes('BAR_ENTER_END')
	);
	const enterEndFrames = enterEndKeyframes.map((it) => it.frame);
	const lastEnterEndFrame = Math.max(...enterEndFrames);
	const lastEnterEndSecond = lastEnterEndFrame / fps;

	const barChartBaseline = dimensions
		? getBarChartBaseline(dimensions.height, data)
		: 10;

	// TODO useCallback
	const CustomBarChartLabelComponent = ({
		children,
		id,
	}: {
		children: string;
		id: string;
	}) => {
		const imageSrc = data.find((it) => it.id === id)?.teamIconUrl;
		invariant(imageSrc);

		return (
			<div
				style={{
					display: 'flex',
					gap: barChartBaseline * 0.6,
					alignItems: 'center',
				}}
			>
				<TypographyStyle
					typographyStyle={theme.typography.textStyles.datavizLabel}
					baseline={barChartBaseline}
				>
					<TextAnimationSubtle
						innerDelayInSeconds={0}
						translateY={barChartBaseline * 1.15}
					>
						{children}
					</TextAnimationSubtle>
				</TypographyStyle>

				<TextAnimationSubtle
					innerDelayInSeconds={0}
					translateY={barChartBaseline * 1.15}
				>
					<Img
						style={{
							borderRadius: '50%',
							width: barChartBaseline * 2,
							height: barChartBaseline * 2,
						}}
						src={imageSrc}
					/>
				</TextAnimationSubtle>
			</div>
		);
	};

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
								data={data}
								width={dimensions.width}
								baseline={barChartBaseline}
								theme={theme}
								keyframes={keyframes}
								CustomLabelComponent={CustomBarChartLabelComponent}
							/>
						</div>
					) : null}
				</div>

				{/* TODO introduce evtl. also absolute positioned footer */}
				<PageFooter theme={theme}>
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
									innerDelayInSeconds={lastEnterEndSecond}
								>
									{dataSource}
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
