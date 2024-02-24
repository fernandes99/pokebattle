import { PokemonService } from '@/services/pokemon';
import { IResponseGetEvolutionChain, IResponseGetPokemonById } from '@/types/pokeApiResponses';
import { COLORS } from '@/constants/colors';
import { IPokemon, IPokemonMove, IPokemonType } from '@/types/pokemon';
import { capitalize } from './string';
import { translatePokemonType } from '@/constants/translate';
import { getRandomIntFromInterval } from './number';
import {
    ACCURACY_MOVE_FALLBACK,
    CAPTURE_RATE_FALLBACK,
    DELTA_ATTACK_TOTAL,
    DELTA_CAPTURE_RATE,
    DELTA_DEFENSE_TOTAL,
    DELTA_HP_BASE,
    DELTA_SP_ATTACK_TOTAL,
    DELTA_SP_DEFENSE_TOTAL,
    DELTA_XP_TOTAL,
    GENERAL_STAT_FALLBACK,
    HP_BASE_FALLBACK,
    POWER_MOVE_FALLBACK
} from '@/constants/deltas';
import { POKEMONS_BASE } from '@/constants/pokemons';

interface GetPokemonProps {
    id?: number;
    name?: string;
    level?: number;
}

interface IPlaySound {
    url: string;
    volume?: number;
    loop?: boolean;
}

interface IFormatPokemon {
    data: IResponseGetPokemonById;
    level: number;
}

export const getMovePokemon = async (moveUrl: string) => {
    const response = await PokemonService.getMoveDetailByUrl(moveUrl);
    const power = response?.power ? response.power : POWER_MOVE_FALLBACK;
    const accuracy = response?.accuracy ? response.accuracy : ACCURACY_MOVE_FALLBACK;

    return {
        id: response?.id,
        name: response?.name,
        title: capitalize(response!.name || ''),
        criticalRate: response?.meta.crit_rate || 0,
        drain: response?.meta.drain,
        classDamage: response?.damage_class.name,
        ailment: {
            chance: response?.meta.ailment_chance || 0,
            name: response?.meta.ailment.name || ''
        },
        type: {
            color: COLORS.TYPE[response!.type.name],
            title: translatePokemonType[response!.type.name],
            name: response!.type.name
        },
        power: power,
        accuracy: accuracy
    } as IPokemonMove;
};

const formatPokemon = async ({ data, level }: IFormatPokemon) => {
    const pokemonTypeData = await Promise.all(
        data.types.map(async (t) => {
            const response = await PokemonService.getTypeDetailByUrl(t.type.url);

            return {
                id: response?.id,
                name: response?.name,
                damageRelations: {
                    doubleDamageFrom: response?.damage_relations.double_damage_from,
                    halfDamageFrom: response?.damage_relations.half_damage_from,
                    noDamageFrom: response?.damage_relations.no_damage_from
                }
            } as IPokemonType;
        })
    );

    const pokemonMovesData = data.moves
        .filter((m) => {
            const minLevel = level < 5 ? 5 : level;

            return (
                m.version_group_details[0].level_learned_at < minLevel && m.version_group_details[0].move_learn_method.name === 'level-up'
            );
        })
        .splice(0, 4);

    const movesFormated = await Promise.all(pokemonMovesData.map(async (m) => getMovePokemon(m.move.url)));
    const pokemonSpecieData = await PokemonService.getSpecieById(data.id);
    const evolutionData = await PokemonService.getEvolutionDetailByUrl(pokemonSpecieData!.evolution_chain.url);

    const getSprite = () => {
        const animated = data.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default;
        return animated ? animated : data.sprites.front_default;
    };

    const getEvolutionData = () => {
        const findCurrentEvolution: (
            chain: IResponseGetEvolutionChain['chain'],
            targetName: string
        ) => IResponseGetEvolutionChain['chain'] | null = (chain, targetName) => {
            if (chain.species.name === targetName) {
                return chain;
            }

            for (const nextEvolution of chain.evolves_to) {
                const foundEvolution = findCurrentEvolution(nextEvolution, targetName);

                if (foundEvolution) {
                    return foundEvolution;
                }
            }

            return null;
        };

        const currentEvolve = findCurrentEvolution(evolutionData!.chain, data.name);
        const nextEvolve = currentEvolve?.evolves_to?.[0] || null;

        return {
            minLevel: nextEvolve?.evolution_details?.[0].min_level || null,
            to: nextEvolve
                ? {
                      name: nextEvolve.species.name,
                      url: nextEvolve.species.url
                  }
                : null
        } as IPokemon['evolution'];
    };

    const HP_BASE = data.stats.find((s) => s.stat.name === 'hp')?.base_stat || HP_BASE_FALLBACK;
    const HP_TOTAL = Math.round(HP_BASE + DELTA_HP_BASE * HP_BASE * (level / 2));
    const XP_TOTAL = data.base_experience * (level + DELTA_XP_TOTAL);

    const ATTACK_BASE = data.stats.find((s) => s.stat.name === 'attack')?.base_stat || GENERAL_STAT_FALLBACK;
    const ATTACK_TOTAL = Math.round(ATTACK_BASE + level * DELTA_ATTACK_TOTAL);

    const SP_ATTACK_BASE = data.stats.find((s) => s.stat.name === 'special-attack')?.base_stat || GENERAL_STAT_FALLBACK;
    const SP_ATTACK_TOTAL = Math.round(SP_ATTACK_BASE + level * DELTA_SP_ATTACK_TOTAL);

    const DEFENSE_BASE = data.stats.find((s) => s.stat.name === 'defense')?.base_stat || GENERAL_STAT_FALLBACK;
    const DEFENSE_TOTAL = Math.round(DEFENSE_BASE + level * DELTA_DEFENSE_TOTAL);

    const SP_DEFENSE_BASE = data.stats.find((s) => s.stat.name === 'defense')?.base_stat || GENERAL_STAT_FALLBACK;
    const SP_DEFENSE_TOTAL = Math.round(SP_DEFENSE_BASE + level * DELTA_SP_DEFENSE_TOTAL);

    const CAPTURE_RATE = pokemonSpecieData?.capture_rate
        ? Math.round(getCaptureRateInPercentage(pokemonSpecieData?.capture_rate) / DELTA_CAPTURE_RATE)
        : CAPTURE_RATE_FALLBACK;

    return {
        id: data.id,
        name: capitalize(data.name),
        sprite: getSprite(),
        sound: data.cries.latest,
        color: COLORS.TYPE[data.types[0].type.name],
        types: pokemonTypeData,
        captureRate: CAPTURE_RATE,
        moves: movesFormated,
        level,
        stats: {
            hp: {
                base: HP_BASE,
                current: HP_TOTAL,
                total: HP_TOTAL
            },
            xp: {
                base: data.base_experience,
                current: getRandomIntFromInterval(data.base_experience * level, XP_TOTAL),
                total: XP_TOTAL
            },
            attack: {
                base: ATTACK_BASE,
                total: ATTACK_TOTAL,
                current: ATTACK_TOTAL
            },
            specialAttack: {
                base: SP_ATTACK_BASE,
                total: SP_ATTACK_TOTAL,
                current: SP_ATTACK_TOTAL
            },
            defense: {
                base: DEFENSE_BASE,
                total: DEFENSE_TOTAL,
                current: DEFENSE_TOTAL
            },
            specialDefense: {
                base: SP_DEFENSE_BASE,
                total: SP_DEFENSE_TOTAL,
                current: SP_DEFENSE_TOTAL
            }
        },
        evolution: getEvolutionData()
    } as IPokemon;
};

export function getPokemon({ id, name, level = 5 }: GetPokemonProps): Promise<IPokemon> {
    let pokemon = id || name || null;

    if (pokemon === null) {
        const base = POKEMONS_BASE.filter((item) => item.pokedex_id <= 649 && item.capture_rate >= 100);
        pokemon = base[getRandomIntFromInterval(0, base.length)].pokedex_id;
    }

    return new Promise((resolve, reject) => {
        PokemonService.getDetail(pokemon!)
            .then(async (pokemonCoreData) => {
                if (!pokemonCoreData) {
                    reject(new Error(`Pokemon com ID ${id} não encontrado.`));
                    return;
                }

                const formattedPokemon = await formatPokemon({ data: pokemonCoreData, level });
                resolve(formattedPokemon);
            })
            .catch(reject);
    });
}

export async function getPokemonMoves(id: number): Promise<IResponseGetPokemonById['moves']> {
    return new Promise((resolve, reject) => {
        PokemonService.getDetail(id)
            .then(async (data) => {
                if (!data) {
                    reject(new Error(`Pokemon com ID ${id} não encontrado.`));
                    return;
                }

                resolve(data.moves);
            })
            .catch(reject);
    });
}

export const playSound = ({ url, volume = 0.2, loop = false }: IPlaySound) => {
    const sound = new Audio(url);

    sound.volume = volume;
    sound.loop = loop;
    sound.play();
};

export const verifyParseCode = (code: string) => {
    try {
        JSON.parse(code);
        return true;
    } catch (error) {
        console.error('Erro ao analisar o código JSON:', error);
        return false;
    }
};

export const getCaptureRateInPercentage = (rate: number) => {
    const TOTAL_RATE = 255;
    return parseFloat(((100 * rate) / TOTAL_RATE).toFixed(2));
};

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
