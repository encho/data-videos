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
};

export default function DisplayGridLayout({
	width,
	height,
	areas,
	hide = false,
}: TDisplayGridLayoutProps) {
	if (hide) {
		return <div />;
	}
	return (
		<div style={{position: 'relative'}}>
			<Svg width={width} height={height}>
				{toPairs(areas).map(([name, area]) => (
					<Area key={name} area={area} show>
						<Title area={area} text={name} />
					</Area>
				))}
			</Svg>
		</div>
	);
}
