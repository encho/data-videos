import {z} from 'zod';
import {zColor} from '@remotion/zod-types';
import generateBrownianMotionTimeSeries from './generateBrownianMotionTimeSeries';
import {AxisTransition2} from './AxisTransition2';
import {getFirstNItems} from './utils';

const timeSeries = generateBrownianMotionTimeSeries(
	new Date(2020, 0, 1),
	new Date(2021, 0, 20)
);

// const end_timeSeries = generateBrownianMotionTimeSeries(
// 	new Date(2020, 0, 1),
// 	new Date(2020, 0, 31)
// );

export const AxisTransitionSchema = z.object({
	backgroundColor: zColor(),
	textColor: zColor(),
});

export const AxisTransition: React.FC<z.infer<typeof AxisTransitionSchema>> = ({
	backgroundColor,
	textColor,
}) => {
	const startTimeSeries = getFirstNItems(timeSeries, 50);
	const endTimeSeries = getFirstNItems(timeSeries, 60);

	return (
		<AxisTransition2
			backgroundColor={backgroundColor}
			textColor={textColor}
			startTimeSeries={startTimeSeries}
			endTimeSeries={endTimeSeries}
		/>
	);
};
