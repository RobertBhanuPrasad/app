export const generateColors = (baseColor: string, numColors: number) => {
    // Parse the base color into RGB components
    const baseRGB = [
        parseInt(baseColor.substring(1, 3), 16), // Red
        parseInt(baseColor.substring(3, 5), 16), // Green
        parseInt(baseColor.substring(5, 7), 16)  // Blue
    ];

    // Calculate the decrease factor for each RGB component
    const decreaseFactor = 25
    // Generate colors
    const colors = [];

    // Include the base color as the first color
    colors.push(baseColor);

    for (let i = 1; i < numColors; i++) { // Start from 1 as we already included the base color
        // Calculate the decrease in brightness for each component
        const decrease = decreaseFactor + i;

        // Decrease brightness for each RGB component
        const newRGB = baseRGB.map(color => Math.max(color - decrease, 0));

        // Convert RGB components back to hexadecimal color code
        const rgbToHex = (rgb: any) => '#' + rgb.map((c: any) => Math.round(c).toString(16).padStart(2, '0')).join('');
        const hexColor = rgbToHex(newRGB);

        colors.push(hexColor);
    }

    return colors;
}


export const getColorWithDecreasedOpacity = (baseColor: any, position: any, maxPosition: any) => {
    // Ensure position is between 1 and maxPosition
    position = Math.max(1, Math.min(maxPosition, position));

    // Convert position to a value between 0 and 1
    const alpha = position / maxPosition;

    // Extract RGB values from the base color
    const hexToRgb = (hex: any) => hex.match(/\w\w/g).map((x: any) => parseInt(x, 16));
    const rgbToHex = (r: any, g: any, b: any) => '#' + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('');
    const [r, g, b] = hexToRgb(baseColor.substr(1));

    // Return color with decreased opacity
    return rgbToHex(r, g, b) + Math.round(alpha * 255).toString(16).padStart(2, '0');
};
