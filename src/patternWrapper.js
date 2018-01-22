import createCanvas from './createCanvas';

function patternWrapper({ canvas, patterns }) {
	// Fluent layering
	const wrappedPatterns = Object.keys(patterns).reduce((acc, patternKey) => {
		const patternFunc = patterns[patternKey];
		acc[patternKey] = optionsInner => {
			const lowerCanvas = patternFunc(optionsInner);
			const width = Math.max(canvas.width, lowerCanvas.width);
			const height = Math.max(canvas.height, lowerCanvas.height);
			const newCanvas = createCanvas(width, height);
			const context = newCanvas.getContext('2d');

			context.fillStyle = context.createPattern(lowerCanvas, 'repeat');
			context.fillRect(0, 0, width, height);
			context.fillStyle = context.createPattern(canvas, 'repeat');
			context.fillRect(0, 0, width, height);

			return patternWrapper({
				canvas: newCanvas,
				patterns,
			});
		};
		return acc;
	}, {});

	return Object.assign(wrappedPatterns, {
		canvas,
		toDataURL() {
			return this.canvas.toDataURL();
		},
		toCSSURL() {
			return `url('${this.toDataURL()}')`;
		},
	});
}

export default patternWrapper;
