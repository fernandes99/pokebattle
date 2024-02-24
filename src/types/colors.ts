interface IPokemonColorType {
    black: string;
    red: string;
    blue: string;
    white: string;
    gray: string;
    brown: string;
    green: string;
    purple: string;
    pink: string;
    yellow: string;
}

export interface IColorsType {
    TYPE: Record<string, string>;
    POKEMONS: IPokemonColorType;
}
