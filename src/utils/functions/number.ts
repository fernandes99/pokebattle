export const getRandomIntFromInterval = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getPercentage = (current: number, total: number) => {
    const result = parseFloat(Math.round((current / total) * 100).toFixed(2));
    return result == Infinity ? 100 : result;
};

export const getWinRate = (win: number, loss: number) => {
    if (!win && !loss) {
        return 100;
    }
    const rate = parseFloat(Math.round((win / (win + loss)) * 100).toFixed(2));
    return rate;
};
