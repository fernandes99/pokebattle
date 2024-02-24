import {
    DELTA_EXP_ON_BATTLE_LOSE,
    DELTA_EXP_ON_BATTLE_WIN,
    DELTA_MONEY_ON_BATTLE_LOSE,
    DELTA_MONEY_ON_BATTLE_WIN
} from '@/constants/deltas';
import { IPokemon, IPokemonMove } from '@/types/pokemon';
import { getRandomIntFromInterval } from './number';
import { IDamageVariants } from '@/types/battle';

interface IGetRewardsBattle {
    allyPokemon: IPokemon;
    enemyPokemon: IPokemon;
    result: 'win' | 'lose';
}

interface IGetDamageVariants {
    move: IPokemonMove;
    pokemonAttacker: IPokemon;
    pokemonTarget: IPokemon;
}

export const getRewardsBattle = ({ allyPokemon, enemyPokemon, result }: IGetRewardsBattle) => {
    const deltaExpFinal = result === 'win' ? DELTA_EXP_ON_BATTLE_WIN : DELTA_EXP_ON_BATTLE_LOSE;
    const deltaMoneyFinal = result === 'win' ? DELTA_MONEY_ON_BATTLE_WIN : DELTA_MONEY_ON_BATTLE_LOSE;

    const expGained = allyPokemon.stats.xp.base * deltaExpFinal * (enemyPokemon.level / allyPokemon.level);
    const expGainedFinal = Math.round(getRandomIntFromInterval(expGained * 0.5, expGained * 1.5));

    const moneyDelta = deltaMoneyFinal * (enemyPokemon.level / allyPokemon.level);
    const moneyDeltaFinal = Math.round(getRandomIntFromInterval(moneyDelta * 0.5, moneyDelta * 1.5));

    return {
        money: moneyDeltaFinal,
        exp: expGainedFinal
    };
};

export const getMultiplicatorType = (type: IPokemonMove['type'], pokemonTarget: IPokemon) => {
    const double = pokemonTarget.types.some((t) => t.damageRelations.doubleDamageFrom.some((i) => type.name === i.name));
    const half = pokemonTarget.types.some((t) => t.damageRelations.halfDamageFrom.some((i) => type.name === i.name));
    const noDamage = pokemonTarget.types.some((t) => t.damageRelations.noDamageFrom.some((i) => type.name === i.name));

    if (double) return 2;
    if (half) return 0.5;
    if (noDamage) return 0;
    return 1;
};

export const getDamageVariants = ({ move, pokemonAttacker, pokemonTarget }: IGetDamageVariants) => {
    console.log(pokemonAttacker);

    return {
        multiplicatorByType: getMultiplicatorType(move.type, pokemonTarget),
        isCritical: move.criticalRate ? move.criticalRate >= getRandomIntFromInterval(0, 100) : false
    } as IDamageVariants;
};
