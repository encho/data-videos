// Function to generate an SVG path for a circle
export function generateCirclePath({
	r,
	cx,
	cy,
}: {
	r: number;
	cx: number;
	cy: number;
}): string {
	// Start the path at the rightmost point of the circle
	const startX = cx + r;
	const startY = cy;

	// Construct the path using SVG arc commands
	const path = `
			M ${startX},${startY} 
			A ${r},${r} 0 1,0 ${cx - r},${cy} 
			A ${r},${r} 0 1,0 ${startX},${startY}
	`.trim();

	return path;
}

// Example usage
// const r = 50;
// const cx = 100;
// const cy = 100;

// const circlePath = generateCirclePath({r, cx, cy});
// console.log(circlePath);
