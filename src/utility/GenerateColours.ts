export const generateColors = (baseColor: string, numColors: number) =>  {
    // Parse the base color into RGB components=>
    const baseRGB = [
        parseInt(baseColor.substr(1, 2), 16), // Red
        parseInt(baseColor.substr(3, 2), 16), // Green
        parseInt(baseColor.substr(5, 2), 16)  // Blue
    ];

    const brightnessDecrease = 31.82;

    // Generate colors
    const colors = [];
    for (let i = 0; i < numColors; i++) {
        // Calculate the brightness decrease for each component
        const decrease = Math.min(brightnessDecrease * (i + 1), 255); // Ensure brightness doesn't go below 0

        // Decrease brightness for each RGB component
        const newRGB = baseRGB.map(color => Math.max(color - decrease, 0));

        // Convert RGB components back to hexadecimal color code
        const newColor = '#' + newRGB.map(color => color.toString(16).padStart(2, '0')).join('');

        colors.push(newColor);
    }

    return colors;
}