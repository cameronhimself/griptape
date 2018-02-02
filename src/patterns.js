/* eslint object-curly-newline: 'off' */

import colorString from 'color-string';
import extend from 'extend';
import seededRandom from 'seed-random';
import createCanvas from './createCanvas';
import { ellipse } from './drawing';

const sanitizers = {
	color(val) {
		if (typeof val === 'function') {
			return this.sanitizer(val());
		}
		if (colorString.get(String(val))) {
			return val;
		}
		return null;
	},
	fill(val) {
		if (! val) return null;
		// duck-type griptape pattern
		if (val.canvas && typeof val.canvas.getContext === 'function') {
			const context = val.canvas.getContext('2d');
			return context.createPattern(val.canvas, 'repeat');
		}
		// duck-type canvas
		if (typeof val.getContext === 'function') {
			const context = val.getContext('2d');
			return context.createPattern(val, 'repeat');
		}
		if (colorString.get(String(val))) {
			const canvas = createCanvas(1, 1);
			const context = canvas.getContext('2d');
			context.fillStyle = val;
			context.fillRect(0, 0, 1, 1);
			context.fill();
			return context.createPattern(canvas, 'repeat');
		}
		if (typeof val === 'function') {
			return this.sanitizer(val());
		}
		return null;
	},
	function(val) {
		if (typeof val === 'function') {
			return val;
		}
		return null;
	},
	number(val) {
		const coerced = Number(val);
		if (Number.isNaN(coerced)) {
			return null;
		}
		return val;
	},
	oneOf(list, fallback) {
		return val => (list.indexOf(val) !== -1 ? val : fallback);
	},
	orientation(val) {
		if (val === 'horizontal' || val === 'horiz' || val === 'h') {
			return 'horizontal';
		}
		if (val === 'vertical' || val === 'vert' || val === 'v') {
			return 'vertical';
		}
		return null;
	},
	percentageDecimal(val) {
		const coerced = parseFloat(val);
		if (Number.isNaN(coerced)) {
			return null;
		}
		if (coerced > 1) {
			return 1;
		}
		if (coerced < 0) {
			return 0;
		}
		return coerced;
	},
	xy(val) {
		if (val) {
			if (Array.isArray(val)) {
				return val;
			}
			return [val, val];
		}
		return null;
	},
};

const commonDefinitions = {
	size: {
		sanitizer: sanitizers.xy,
	},
	color: {
		sanitizer: sanitizers.color,
		default: 'rgba(0, 0, 0, 0.05)',
	},
	background: {
		sanitizer: sanitizers.fill,
		default: null,
	},
	foreground: {
		sanitizer: sanitizers.fill,
		default: 'rgba(0, 0, 0, 0.05)',
	},
	bgColor: {
		sanitizer: sanitizers.color,
		default: null,
	},
	scale: {
		sanitizer: sanitizers.xy,
		default: [1, 1],
	},
};

function sanitizeOptions(definitionsArg, optionsArg) {
	const options = optionsArg || {};
	const definitions = extend(true, {}, commonDefinitions, definitionsArg);
	const sanitized = {};
	Object.keys(definitions).forEach(optKey => {
		const def = definitions[optKey];
		sanitized[optKey] = options[optKey];
		sanitized[optKey] = def.sanitizer(options[optKey]) || def.sanitizer(def.default);
	});
	return sanitized;
}

const patterns = {
	checkerboard(optionsArg) {
		const { foreground, background, scale, size } = sanitizeOptions({
			size: { default: 20 },
		}, optionsArg);
		const canvas = createCanvas(size[0] * scale[0], size[1] * scale[1]);
		const context = canvas.getContext('2d');
		context.scale(scale[0], scale[1]);
		if (background) {
			context.fillStyle = background;
			context.fillRect(0, 0, size[0], size[1]);
		}

		const squareSize = [size[0] / 2, size[1] / 2];
		context.fillStyle = foreground;
		context.fillRect(0, 0, squareSize[0], squareSize[1]);
		context.fillRect(squareSize[0], squareSize[1], squareSize[0], squareSize[1]);
		context.setTransform(1, 0, 0, 1, 0, 0);

		return canvas;
	},

	dots(optionsArg) {
		const { foreground, background, scale, size, dotSize, pattern, shape } = sanitizeOptions({
			shape: {
				default: 'circle',
				sanitizer: sanitizers.oneOf(['circle', 'square', 'triangle']),
			},
			pattern: {
				default: 'diamond',
				sanitizer: sanitizers.oneOf(['square', 'diamond']),
			},
			size: { default: 10 },
			dotSize: { default: 3, sanitizer: sanitizers.xy },
		}, optionsArg);
		const canvas = createCanvas(size[0] * scale[0], size[1] * scale[1]);
		const context = canvas.getContext('2d');
		context.scale(scale[0], scale[1]);
		if (background) {
			context.fillStyle = background;
			context.fillRect(0, 0, size[0], size[1]);
		}

		function dot(ctx, x, y, width, height) {
			if (shape === 'circle') {
				ellipse(ctx, x, y, width, height);
			} else {
				ctx.fillRect(x, y, width, height);
			}
		}

		context.fillStyle = foreground;
		dot(
			context,
			(size[0] / 2) - (dotSize[0] / 2),
			(size[1] / 2) - (dotSize[1] / 2),
			dotSize[0],
			dotSize[1],
		);
		if (pattern === 'diamond') {
			dot(context, -(dotSize[0] / 2), -(dotSize[1] / 2), dotSize[0], dotSize[1]);
			dot(context, -(dotSize[0] / 2), size[1] - (dotSize[1] / 2), dotSize[0], dotSize[1]);
			dot(context, size[0] - (dotSize[0] / 2), -(dotSize[1] / 2), dotSize[0], dotSize[1]);
			dot(context, size[0] - (dotSize[0] / 2), size[1] - (dotSize[1] / 2), dotSize[0], dotSize[1]);
		}
		context.setTransform(1, 0, 0, 1, 0, 0);

		return canvas;
	},

	grid(optionsArg) {
		const { foreground, background, scale, shape, size, thickness } = sanitizeOptions({
			size: { default: 10 },
			thickness: { default: 1, sanitizer: sanitizers.number },
			shape: {
				default: 'square',
				sanitizer: sanitizers.oneOf(['square', 'diamond']),
			},
		}, optionsArg);
		const canvas = createCanvas(size[0] * scale[0], size[1] * scale[1]);
		const context = canvas.getContext('2d');
		context.scale(scale[0], scale[1]);
		if (background) {
			context.fillStyle = background;
			context.fillRect(0, 0, size[0], size[1]);
		}

		context.strokeStyle = foreground;
		context.lineWidth = thickness;
		if (shape === 'diamond') {
			context.beginPath();
			context.moveTo(0, size[1] / 2);
			context.lineTo(size[0] / 2, 0);
			context.lineTo(size[0], size[1] / 2);
			context.lineTo(size[0] / 2, size[1]);
			context.lineTo(0, size[1] / 2);
			context.stroke();
		} else {
			context.strokeRect(0, 0, size[0], size[1]);
		}
		context.setTransform(1, 0, 0, 1, 0, 0);

		return canvas;
	},

	houndstooth(optionsArg) {
		const { foreground, background, scale, size } = sanitizeOptions({
			size: { default: 20 },
		}, optionsArg);
		const canvas = createCanvas(size[0] * scale[0], size[1] * scale[1]);
		const context = canvas.getContext('2d');
		context.scale(scale[0], scale[1]);
		if (background) {
			context.fillStyle = background;
			context.fillRect(0, 0, size[0], size[1]);
		}

		context.strokeStyle = foreground;
		context.fillStyle = foreground;
		context.fillRect(0, 0, size[0] / 2, size[1] / 2);
		context.beginPath();
		context.moveTo(size[0] * 0.5, 0);
		context.lineTo(size[0] * 0.75, 0);
		context.lineTo(size[0] * 0.5, size[1] * 0.25);
		context.lineTo(size[0] * 0.5, 0);

		context.moveTo(size[0] * 0.5, size[1] * 0.5);
		context.lineTo(size[0], 0);
		context.lineTo(size[0], size[1] * 0.25);
		context.lineTo(size[0] * 0.75, size[1] * 0.5);
		context.lineTo(size[0] * 0.5, size[1] * 0.5);

		context.moveTo(size[0] * 0.5, size[1]);
		context.lineTo(size[0] * 0.25, size[1]);
		context.lineTo(size[0] * 0.5, size[1] * 0.75);
		context.lineTo(size[0] * 0.5, size[1]);

		context.moveTo(0, size[1]);
		context.lineTo(size[0] * 0.5, size[1] * 0.5);
		context.lineTo(size[0] * 0.25, size[1] * 0.5);
		context.lineTo(0, size[1] * 0.75);
		context.lineTo(0, size[1]);
		context.fill();

		context.setTransform(1, 0, 0, 1, 0, 0);

		return canvas;
	},

	noise(optionsArg) {
		const { foreground, background, density, randomizer, size, scale, seed } = sanitizeOptions({
			foreground: { sanitizer: sanitizers.color },
			size: { default: 200 },
			density: { default: 1, sanitizer: sanitizers.percentageDecimal },
			randomizer: { default: null, sanitizer: sanitizers.function },
			seed: { default: 'griptape', sanitizer: String },
		}, optionsArg);
		const realRandomizer = randomizer || seededRandom(seed);
		const canvasSize = [size[0], size[1]];
		const canvas = createCanvas(size[0] * scale[0], size[1] * scale[1]);
		const context = canvas.getContext('2d');
		context.scale(scale[0], scale[1]);
		if (background) {
			context.fillStyle = background;
			context.fillRect(0, 0, size[0], size[1]);
		}

		for (let x = 0; x < canvasSize[0]; x++) {
			for (let y = 0; y < canvasSize[1]; y++) {
				const randOpacity = realRandomizer();
				const colorObj = colorString.get(foreground);
				if (randOpacity >= density) {
					colorObj.value[3] = 0;
				} else {
					colorObj.value[3] *= randOpacity;
				}

				context.fillStyle = colorString.to[colorObj.model](colorObj.value);
				context.fillRect(x, y, 1, 1);
			}
		}
		context.setTransform(1, 0, 0, 1, 0, 0);

		return canvas;
	},

	stripes(optionsArg) {
		const { foreground, background, scale, size, orientation, thickness } = sanitizeOptions({
			size: { default: 20 },
			thickness: { default: 10, sanitizer: sanitizers.number },
			orientation: { default: 'vertical', sanitizer: sanitizers.orientation },
		}, optionsArg);
		const canvas = createCanvas(size[0] * scale[0], size[1] * scale[1]);
		const context = canvas.getContext('2d');
		context.scale(scale[0], scale[1]);
		if (background) {
			context.fillStyle = background;
			context.fillRect(0, 0, size[0], size[1]);
		}

		context.fillStyle = foreground;
		if (orientation === 'vertical') {
			context.fillRect(-(thickness / 2), 0, thickness, size[1]);
			context.fillRect(size[0] - (thickness / 2), 0, thickness, size[1]);
		}
		if (orientation === 'horizontal') {
			context.fillRect(0, 0, size[0], thickness * size[1]);
		}
		context.setTransform(1, 0, 0, 1, 0, 0);

		return canvas;
	},
};

export default patterns;
