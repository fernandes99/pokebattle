import {
    DELTA_EXP_ON_BATTLE_LOSE,
    DELTA_EXP_ON_BATTLE_WIN,
    DELTA_MONEY_ON_BATTLE_LOSE,
    DELTA_MONEY_ON_BATTLE_WIN
} from '@/constants/deltas';
import { IPokemon, IPokemonMove } from '@/types/pokemon';
import { getPercentage, getRandomIntFromInterval } from './number';
import { IDamageVariants } from '@/types/battle';
import { Dispatch } from '@reduxjs/toolkit';
import {
    addBattleLog,
    changePokemonAllyStat,
    changePokemonEnemyStat,
    setPokemonEnemyCaptureRate,
    setPokemonEnemyCurrentHp,
    setPokemonPlayerCurrentHp
} from '@/store/reducers/battle';

interface IGetRewardsBattle {
    allyPokemon: IPokemon;
    enemyPokemon: IPokemon;
    result: 'win' | 'lose';
}

interface IGetDamageVariants {
    move: IPokemonMove;
    pokemonTarget: IPokemon;
}

interface IHandleStatsChange {
    move: IPokemonMove;
    isEnemyAttack: boolean;
    pokemonEnemy: IPokemon;
    pokemonAlly: IPokemon;
    dispatch: Dispatch;
}

interface IHandleDamageMove {
    move: IPokemonMove;
    currentHp: number;
    damage: number;
    isEnemyAttack: boolean;
    pokemonEnemy: IPokemon;
    pokemonAlly: IPokemon;
    dispatch: Dispatch;
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
    if (half) return 0.25;
    if (noDamage) return 0;
    return 1;
};

export const getDamageVariants = ({ move, pokemonTarget }: IGetDamageVariants) => {
    return {
        multiplicatorByType: getMultiplicatorType(move.type, pokemonTarget),
        isCritical: move.criticalRate ? move.criticalRate >= getRandomIntFromInterval(0, 100) : false
    } as IDamageVariants;
};

export const handleStatsChange = ({ move, isEnemyAttack, pokemonEnemy, pokemonAlly, dispatch }: IHandleStatsChange) => {
    move.statChanges.forEach((stat) => {
        const labelValue = stat.change > 0 ? 'aumentou' : 'diminuiu';

        if (stat.target === 'user') {
            if (isEnemyAttack) {
                const statChangeValue = Math.round(pokemonEnemy.stats[stat.name].current * 0.1 * stat.change);
                dispatch(addBattleLog(`{enemy} ${labelValue} em **${Math.abs(statChangeValue)} seu ${stat.name}**`));
                return dispatch(changePokemonEnemyStat({ stat: stat.name, value: statChangeValue }));
            }

            const statChangeValue = Math.round(pokemonAlly.stats[stat.name].current * 0.1 * stat.change);
            dispatch(addBattleLog(`{ally} ${labelValue} em **${Math.abs(statChangeValue)} seu ${stat.name}**`));
            return dispatch(changePokemonAllyStat({ stat: stat.name, value: statChangeValue }));
        }

        if (isEnemyAttack) {
            const statChangeValue = Math.round(pokemonAlly.stats[stat.name].current * 0.1 * stat.change);
            dispatch(addBattleLog(`{enemy} ${labelValue} **${Math.abs(statChangeValue)} de ${stat.name}** do {ally}`));
            return dispatch(changePokemonAllyStat({ stat: stat.name, value: statChangeValue }));
        }

        const statChangeValue = Math.round(pokemonEnemy.stats[stat.name].current * 0.1 * stat.change);
        dispatch(addBattleLog(`{ally} ${labelValue} **${Math.abs(statChangeValue)} de ${stat.name}** do {enemy}`));
        return dispatch(changePokemonEnemyStat({ stat: stat.name, value: statChangeValue }));
    });
};

export const handleDamageMove = ({ move, currentHp, damage, isEnemyAttack, pokemonEnemy, pokemonAlly, dispatch }: IHandleDamageMove) => {
    const updateRate = () => {
        const hpPercentage = getPercentage(currentHp, pokemonEnemy.stats.hp.total);

        if (hpPercentage <= 5) return dispatch(setPokemonEnemyCaptureRate(pokemonEnemy.captureRate * 3));
        if (hpPercentage <= 20) return dispatch(setPokemonEnemyCaptureRate(pokemonEnemy.captureRate * 2));
        if (hpPercentage <= 50) return dispatch(setPokemonEnemyCaptureRate(pokemonEnemy.captureRate * 1.3));
        if (hpPercentage <= 90) return dispatch(setPokemonEnemyCaptureRate(pokemonEnemy.captureRate * 1.1));
    };

    const handleEnemyAttack = () => {
        dispatch(setPokemonPlayerCurrentHp(currentHp));
        dispatch(addBattleLog(`{enemy} usou **${move.title}**`));
        dispatch(addBattleLog(`{enemy} causou **${damage} de dano** em {ally}`));

        if (move.drain) {
            const drainValue = damage / 2;
            dispatch(addBattleLog(`{enemy} drenou **${drainValue}** de {ally}`));
            dispatch(setPokemonEnemyCurrentHp(pokemonEnemy.stats.hp.current + drainValue));
        }
    };

    const handleAllyAttack = () => {
        dispatch(setPokemonEnemyCurrentHp(currentHp));
        dispatch(addBattleLog(`{ally} usou **${move.title}**`));
        dispatch(addBattleLog(`{ally} causou **${damage} de dano** em {enemy}`));
        updateRate();

        if (move.drain) {
            const drainValue = damage / 2;
            dispatch(addBattleLog(`{ally} drenou **${drainValue}** de {enemy}`));
            dispatch(setPokemonPlayerCurrentHp(pokemonAlly.stats.hp.current + drainValue));
        }
    };

    return isEnemyAttack ? handleEnemyAttack() : handleAllyAttack();
};
