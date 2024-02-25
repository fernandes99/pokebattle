export interface IResponseGetPokemonById {
    id: number;
    name: string;
    base_experience: number;
    weight: number;
    sprites: {
        front_default: string;
        versions?: {
            'generation-v'?: {
                'black-white'?: {
                    animated?: {
                        front_default?: string;
                    };
                };
            };
        };
    };
    cries: {
        latest: string;
    };
    moves: IResponsePokemonMove[];
    stats: {
        base_stat: number;
        stat: {
            name: string;
            url: string;
        };
    }[];
    types: {
        slot: number;
        type: {
            name: string;
            url: string;
        };
    }[];
}

export interface IResponseGetSpecieById {
    base_happiness: number;
    capture_rate: number;
    hatch_counter: number;
    is_baby: boolean;
    is_legendary: boolean;
    is_mythical: boolean;
    gender_rate: number;
    color: {
        name: string;
    };
    evolution_chain: {
        url: string;
    };
}

export interface IResponseGetMove {
    id: number;
    name: string;
    accuracy: number;
    power: number;
    damage_class: {
        name: string;
        url: string;
    };
    type: {
        name: string;
        url: string;
    };
    flavor_text_entries: [
        {
            flavor_text: string;
            language: {
                name: string;
                url: string;
            };
        }
    ];
    stat_changes: {
        change: 1 | -1;
        stat: {
            name: TResponseStatName;
            url: string;
        };
    }[];
    target: {
        name: 'user' | 'all-opponents';
        url: string;
    };
    meta: {
        ailment: {
            name: string;
            url: string;
        };
        category: {
            name: string;
            url: string;
        };
        ailment_chance: number;
        crit_rate: number;
        drain: number;
        flinch_chance: number;
        healing: number;
        max_hits: number | null;
        max_turns: number | null;
        min_hits: number | null;
        min_turns: number | null;
        stat_chance: number;
    };
}

export interface IResponseGetType {
    id: number;
    name: string;
    damage_relations: {
        double_damage_from: {
            name: string;
            url: string;
        }[];
        double_damage_to: {
            name: string;
            url: string;
        }[];
        half_damage_from: {
            name: string;
            url: string;
        }[];
        half_damage_to: {
            name: string;
            url: string;
        }[];
        no_damage_from: {
            name: string;
            url: string;
        }[];
        no_damage_to: {
            name: string;
            url: string;
        }[];
    };
    move_damage_class: {
        name: string;
        url: string;
    };
}

export interface IResponseGetEvolutionChain {
    id: number;
    chain: IChain;
}

export type TResponseStatName = 'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed' | 'accuracy' | 'evasion';

interface IChain {
    evolution_details: {
        min_affection: number | null;
        min_beauty: number | null;
        min_happiness: number | null;
        min_level: 36;
        trigger: {
            name: string;
            url: string;
        };
    }[];
    is_baby: boolean;
    species: {
        name: string;
        url: string;
    };
    evolves_to: IChain[];
}

export interface IResponsePokemonMove {
    move: {
        name: string;
        url: string;
    };
    version_group_details: {
        level_learned_at: number;
        move_learn_method: {
            name: string;
            url: string;
        };
    }[];
}
