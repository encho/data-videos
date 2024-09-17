// import {Sequence} from 'remotion';

// import {Position} from '../Position';
// import {Position} from '../AnimatedLineChartScaleBand/components/Position';
// import {SubtleSlideIn, SubtleSlideOut} from './SubtleSlideIn';

export const TwoChangeBarsComponent: React.FC<{
	height: number;
	width: number;
	startValue: number;
	endValue: number;
}> = ({height, width, startValue, endValue}) => {
	return (
		<div style={{backgroundColor: 'cyan', width, height}}>
			<div style={{fontSize: 40}}>startValue: {startValue}</div>
			<div style={{fontSize: 40}}>endValue: {endValue}</div>
		</div>
	);
};
