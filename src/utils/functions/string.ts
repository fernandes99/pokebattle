export const capitalize = (value: string) => {
    return value.replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase());
};

export const slugToTitle = (slug: string) => {
    const words = slug.split('-');
    const title = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return title;
};
