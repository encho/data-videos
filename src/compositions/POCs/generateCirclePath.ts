// Function to generate an SVG path for a circle
export function generateCirclePath(
	radius: number,
	xCenter: number,
	yCenter: number
): string {
	// Start the path at the rightmost point of the circle
	const startX = xCenter + radius;
	const startY = yCenter;

	// Construct the path using SVG arc commands
	const path = `
			M ${startX},${startY} 
			A ${radius},${radius} 0 1,0 ${xCenter - radius},${yCenter} 
			A ${radius},${radius} 0 1,0 ${startX},${startY}
	`.trim();

	return path;
}

// Example usage
// const radius = 50;
// const xCenter = 100;
// const yCenter = 100;

// const circlePath = generateCirclePath(radius, xCenter, yCenter);
// console.log(circlePath);
