import {
	delayRender,
	continueRender,
	AbsoluteFill,
	useVideoConfig,
} from 'remotion';
import {z} from 'zod';
import {useEffect, useState} from 'react';

import {PageContext} from '../../../../acetti-components/PageContext';
import {Page} from '../../../../acetti-components/Page';
import {useThemeFromEnum} from '../../../../acetti-themes/getThemeFromEnum';
import {GlobalVideoContextWrapper} from '../../../../acetti-components/GlobalVideoContext';
import {TimeseriesAnimation} from './TimeseriesAnimation';
import generateBrownianMotionTimeSeries from '../../../../acetti-ts-utils/timeSeries/generateBrownianMotionTimeSeries';
import {TimeSeries} from '../../../../acetti-ts-utils/timeSeries/timeSeries';

export const periodScaleAnimationDevCompositionSchema = z.object({
	firstDate: z.date(),
	lastDate: z.date(),
	themeEnum: z.enum(['NERDY', 'LORENZOBERTOLINI', 'LORENZOBERTOLINI_BRIGHT']),
});

export const PeriodScaleAnimationDevComposition: React.FC<
	z.infer<typeof periodScaleAnimationDevCompositionSchema>
> = ({firstDate, lastDate, themeEnum}) => {
	// TODO actually get height and with as props
	const {height, width} = useVideoConfig();

	const [timeseries, setTimeseries] = useState<null | TimeSeries>(null);

	const theme = useThemeFromEnum(themeEnum);

	useEffect(() => {
		const handle = delayRender('GENERATE_TIMESERIES');
		const generatedTimeseries = generateBrownianMotionTimeSeries(
			firstDate,
			lastDate
		);
		setTimeseries(generatedTimeseries);
		continueRender(handle);
	}, [firstDate, lastDate]);

	if (!timeseries) {
		return <AbsoluteFill />;
	}

	return (
		<GlobalVideoContextWrapper>
			<PageContext
				width={width}
				height={height}
				margin={0}
				nrBaselines={40}
				theme={theme}
			>
				<Page>
					{({contentWidth, contentHeight}) => {
						return (
							<TimeseriesAnimation
								width={contentWidth}
								height={contentHeight}
								timeSeries={timeseries}
								theme={theme}
							/>
						);
					}}
				</Page>
			</PageContext>
		</GlobalVideoContextWrapper>
	);
};
