import { IPokemon } from './pokemon';

export interface IBattle {
    logs: string[];
    round: 'ally' | 'enemy';
    status: 'in-progress' | 'win' | 'lose' | 'pokemon-catched' | 'pokemon-catching' | 'pokemon-lost';
    pokemon: {
        ally: IPokemon | null;
        enemy: IPokemon | null;
    };
}

export interface IDamageVariants {
    multiplicatorByType: 0 | 0.5 | 1 | 2;
    isCritical: boolean;
}
