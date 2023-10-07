export const truncateString = (string: string, start: number, end?: number) => {
    const stringLenght = string.length;
    if (start >= string.length) return string; // no need to truncate
    
    const firstPart = string.substring(0, start);
    if (end) {
        const secondPart = string.substring(stringLenght - end, stringLenght);
        return `${firstPart}...${secondPart}`
    }
    return `${firstPart}...`
}