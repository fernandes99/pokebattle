export interface IPokemon {
    id: number;
    name: string;
    level: number;
    sprite: string;
    sound: string;
    color: string;
    captureRate: number;
    types: IPokemonType[];
    moves: IPokemonMove[];
    state: TPokemonState[];
    stats: {
        hp: {
            base: number;
            total: number;
            current: number;
        };
        xp: {
            base: number;
            total: number;
            current: number;
        };
        attack: {
            base: number;
            total: number;
            current: number;
        };
        specialAttack: {
            base: number;
            total: number;
            current: number;
        };
        defense: {
            base: number;
            total: number;
            current: number;
        };
        specialDefense: {
            base: number;
            total: number;
            current: number;
        };
    };
    evolution: {
        minLevel: number | null;
        to: {
            name: string;
            url: string;
        } | null;
    };
}

export interface IPokemonType {
    id: number;
    name: TPokemonTypeName;
    damageRelations: {
        doubleDamageFrom: {
            name: string;
            url: string;
        }[];
        halfDamageFrom: {
            name: string;
            url: string;
        }[];
        noDamageFrom: {
            name: string;
            url: string;
        }[];
    };
}

export interface IPokemonMove {
    id: number;
    name: string;
    title: string;
    power: number;
    accuracy: number;
    criticalRate: number;
    drain: number;
    classDamage: 'physical' | 'special' | 'status';
    ailment: {
        name: string;
        chance: number;
    };
    type: {
        name: string;
        title: string;
        color: string;
    };
}

type TPokemonState = 'burn' | 'paralysis' | 'sleep' | 'poison';

type TPokemonTypeName =
    | 'normal'
    | 'fire'
    | 'water'
    | 'electric'
    | 'grass'
    | 'ice'
    | 'fighting'
    | 'poison'
    | 'ground'
    | 'flying'
    | 'psychic'
    | 'bug'
    | 'rock'
    | 'ghost'
    | 'dragon'
    | 'dark'
    | 'fairy'
    | 'steel';
