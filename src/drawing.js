function ellipse(ctx, x, y, w, h) {
	const kappa = 0.5522848;
	const ox = (w / 2) * kappa;
	const oy = (h / 2) * kappa;
	const xe = x + w;
	const ye = y + h;
	const xm = x + (w / 2);
	const ym = y + (h / 2);

	ctx.beginPath();
	ctx.moveTo(x, ym);
	ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
	ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
	ctx.fill();
}

export { ellipse };
