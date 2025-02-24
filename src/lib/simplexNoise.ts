import { makeNoise3D } from "open-simplex-noise";

const noise = makeNoise3D(Date.now());

export function drawDeformedCircle(ctx: CanvasRenderingContext2D,
    circle: { x: number, y: number, radius: number },
    frequency: number,
    magnitude: number,
    seed: number = 0): void {
    ctx.beginPath();

    // Sample points evenly around the circle
    const samples = Math.floor(4 * circle.radius + 20);
    for (let j = 0; j < samples + 1; ++j) {
        const angle = (2 * Math.PI * j) / samples;

        // Figure out the x/y coordinates for the given angle
        const x = Math.cos(angle);
        const y = Math.sin(angle);

        // Randomly deform the radius of the circle at this point
        const deformation = noise(x * frequency,
            y * frequency,
            seed) + 1;
        const radius = circle.radius * (1 + magnitude * deformation);

        // Extend the circle to this deformed radius
        ctx.lineTo(circle.x + radius * x,
            circle.y + radius * y);
    }
    ctx.stroke();
}

export function drawFlower(ctx: CanvasRenderingContext2D,
    circle: { x: number, y: number, radius: number },
    fromColor: string = "#000000", toColor: string = "#ffffff",
    frequency: number = 2.0, magnitude: number = 0.5,
    independence: number = 0.1, spacing: number = 0.05,
    count: number = 50): void {
    // adjust the radius so will have roughly the same size regardless of magnitude
    let current = { ...circle };
    current.radius /= (magnitude + 1);
    

    const from = parseInt(fromColor.slice(1), 16);
    const to = parseInt(toColor.slice(1), 16);

    const r1 = (from >> 16) & 0xff;
    const g1 = (from >> 8) & 0xff;
    const b1 = from & 0xff;

    const r2 = (to >> 16) & 0xff;
    const g2 = (to >> 8) & 0xff;
    const b2 = to & 0xff;

    for (let i = 0; i < count; ++i) {
        const t = i / (count - 1);
        const r = Math.round(r1 + t * (r2 - r1));
        const g = Math.round(g1 + t * (g2 - g1));
        const b = Math.round(b1 + t * (b2 - b1));
        ctx.strokeStyle = `rgb(${r},${g},${b})`;

        // draw a circle, the final parameter controlling how similar it is to
        // other circles in this image
        drawDeformedCircle(ctx, current,
            frequency, magnitude,
            i * independence);

        // shrink the radius of the next circle
        current.radius *= (1 - spacing);
    }
}