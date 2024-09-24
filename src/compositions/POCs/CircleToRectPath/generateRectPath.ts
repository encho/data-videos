// Input type for the rectangle with optional corner radii
type RectParams = {
	x: number;
	y: number;
	width: number;
	height: number;
	rTopLeft?: number;
	rTopRight?: number;
	rBottomLeft?: number;
	rBottomRight?: number;
};

// Function to generate an SVG path for a rectangle with optional rounded corners
export function generateRectPath({
	x,
	y,
	width,
	height,
	rTopLeft = 0,
	rTopRight = 0,
	rBottomLeft = 0,
	rBottomRight = 0,
}: RectParams): string {
	// Ensure radii do not exceed half of width/height to maintain valid geometry
	rTopLeft = Math.min(rTopLeft, width / 2, height / 2);
	rTopRight = Math.min(rTopRight, width / 2, height / 2);
	rBottomLeft = Math.min(rBottomLeft, width / 2, height / 2);
	rBottomRight = Math.min(rBottomRight, width / 2, height / 2);

	const path = `
			M ${x + rTopLeft},${y} 
			H ${x + width - rTopRight} 
			A ${rTopRight},${rTopRight} 0 0 1 ${x + width},${y + rTopRight} 
			V ${y + height - rBottomRight} 
			A ${rBottomRight},${rBottomRight} 0 0 1 ${x + width - rBottomRight},${
		y + height
	} 
			H ${x + rBottomLeft} 
			A ${rBottomLeft},${rBottomLeft} 0 0 1 ${x},${y + height - rBottomLeft} 
			V ${y + rTopLeft} 
			A ${rTopLeft},${rTopLeft} 0 0 1 ${x + rTopLeft},${y} 
			Z
	`.trim();

	return path;
}

// // Example usage with rounded corners
// const rectWithRoundedCorners = {
// 	x: 50,
// 	y: 50,
// 	width: 100,
// 	height: 200,
// 	rTopLeft: 20,
// 	rTopRight: 15,
// 	rBottomLeft: 10,
// 	rBottomRight: 5,
// };

// const rectPathWithRadii = generateRectPath(rectWithRoundedCorners);
// console.log(rectPathWithRadii);
