import {AbsoluteFill} from 'remotion';
import {z} from 'zod';
import {HorizontalBarsStar} from '../HorizontalBarsStar/HorizontalBarsStar';
import LorenzoBertoliniLogo from './LorenzoBertoliniLogo';

const LORENZO_BLACK = '#222';
const LORENZO_WHITE = '#FFF';

// const COLORS = {
// 	background: '#1c2541',
// 	text: '#CAD8DE',
// 	placements: {
// 		champions: '#76E7CD',
// 		uefa: '#9B7EDE',
// 		uefaConference: '#C45BAA',
// 	},
// };

const FLIC_COLORS = {
	background: LORENZO_BLACK,
	progressColor: 'transparent',
	title: LORENZO_WHITE,
	bar: {
		// background: LORENZO_BLACK,
		background: LORENZO_WHITE,
		text: LORENZO_BLACK,
		placements: {
			champions: '#76E7CD',
			uefa: '#9B7EDE',
			uefaConference: '#C45BAA',
		},
	},
};

// these colors are BAR_COLORS
// const COLORS = {
// 	background: LORENZO_BLACK,
// 	text: LORENZO_WHITE,
// 	placements: {
// 		champions: '#76E7CD',
// 		uefa: '#9B7EDE',
// 		uefaConference: '#C45BAA',
// 	},
// };

export const bundesligaTop10BarChartSchema = z.object({
	year: z.number(),
	dateString: z.string(),
	apiData: z
		.array(
			z.object({
				teamName: z.string(),
				points: z.number(),
				matches: z.number(),
				teamIconUrl: z.string(),
			})
		)
		.nullable(),
});

export const BundesligaTop10BarChart: React.FC<
	z.infer<typeof bundesligaTop10BarChartSchema>
> = ({apiData, dateString, year}) => {
	// TODO use tiny-invariant
	if (apiData === null) {
		throw new Error('Data was not fetched');
	}

	const horizontalBarsStartDataItems = apiData
		.filter((_it, i) => i < 10)
		.map((it, i) => {
			return {
				label: it.teamName,
				description: `${it.points} Punkte`,
				value: it.points,
				colors: {
					background: FLIC_COLORS.bar.background,
					text: FLIC_COLORS.bar.text,
					border:
						i < 4
							? FLIC_COLORS.bar.placements.champions
							: i === 4
							? FLIC_COLORS.bar.placements.uefa
							: i === 5
							? FLIC_COLORS.bar.placements.uefaConference
							: 'transparent',
				},
				imageSource: it.teamIconUrl,
			};
		});

	const horizontalBarsStarProps = {
		titleText: `Top 10 Bundesliga Teams | ${dateString}`,
		titleFontSize: 44,
		titleColor: FLIC_COLORS.title,
		backgroundColor: FLIC_COLORS.background,
		progressColor: FLIC_COLORS.progressColor,
		items: horizontalBarsStartDataItems,
	};

	return (
		<AbsoluteFill>
			<HorizontalBarsStar {...horizontalBarsStarProps} />
			<LorenzoBertoliniLogo />
		</AbsoluteFill>
	);
};
