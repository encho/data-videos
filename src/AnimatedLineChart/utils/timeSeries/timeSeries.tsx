import {TimeSeries} from './generateBrownianMotionTimeSeries';

//TODO  TIMESERIES NAMESPACE
// *********************
export function getFirstNItems(timeSeries: TimeSeries, n: number): TimeSeries {
	return timeSeries.slice(0, n);
}
