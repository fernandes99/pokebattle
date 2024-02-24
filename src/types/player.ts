import { IPokemon } from './pokemon';

export interface IPlayer {
    name: string;
    pokemons: IPokemon[];
    statistics: {
        fight: {
            total: number;
            wins: number;
            loses: number;
        };
    };
    inventory: {
        money: number;
        pokeballs: {
            simple: number;
            great: number;
            ultra: number;
        };
        potions: {
            simple: number;
            super: number;
            hyper: number;
            max: number;
        };
    };
}
