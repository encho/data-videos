import {TGridLayoutArea} from '../types2';

type TTitleProps = {
	area: TGridLayoutArea;
	text: string;
};

export default function Title({area, text}: TTitleProps) {
	const defaultTextColor = '#000000';

	return (
		<text
			opacity={0.1}
			x={area.width / 2}
			y={area.height / 2}
			style={{
				dominantBaseline: 'central',
				textAnchor: 'middle',
				fill: defaultTextColor,
				stroke: 'none',
				// TODO from video settings / theme settings
				fontSize: 40,
			}}
		>
			{text}
		</text>
	);
}
