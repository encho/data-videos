import {toPairs} from 'lodash';
import {TGridLayoutArea} from '../types2';
import Area from './Area';
import Svg from './Svg';
import Title from './Title';

type TDisplayGridLayoutProps = {
	width: number;
	height: number;
	areas: {[k: string]: TGridLayoutArea};
	hide?: boolean;
	fill?: string;
	stroke?: string;
};

export default function DisplayGridLayout({
	width,
	height,
	areas,
	hide = false,
	fill,
	stroke,
}: TDisplayGridLayoutProps) {
	if (hide) {
		return <div />;
	}
	return (
		<div style={{position: 'relative'}}>
			<Svg width={width} height={height} stroke={stroke} fill={fill}>
				{toPairs(areas).map(([name, area]) => (
					<Area key={name} area={area} show fill={fill} stroke={stroke}>
						<Title area={area} text={name} />
					</Area>
				))}
			</Svg>
		</div>
	);
}
