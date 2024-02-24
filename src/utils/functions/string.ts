export const capitalize = (value: string) => {
    return value.replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase());
};
