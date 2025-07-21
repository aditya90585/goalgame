export function calculateSpribeMultiplier(stepCount, columns) {
    const steps = Number(stepCount);
    const cols = Number(columns);

    if (!cols || cols <= 1 || isNaN(steps)) return 1;



    if (!steps || !cols || cols <= 1) return 1;

    const chance = (cols - 1) / cols; // chance of hitting safe tile
    const baseMultiplier = Math.pow(1 / chance, steps);

    const houseEdge = 0.98; // 2% house edge
    const finalMultiplier = baseMultiplier * houseEdge;

    return parseFloat(finalMultiplier.toFixed(2));


}