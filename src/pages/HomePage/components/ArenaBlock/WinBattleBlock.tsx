import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/store';
import { addBattleLog, resetBattleState } from '@/store/reducers/battle';
import { addExpPlayerPokemon, setPlayerFightStatistics, setPlayerMoney } from '@/store/reducers/player';
import { IPokemon } from '@/types/pokemon';
import { getRewardsBattle } from '@/utils/functions/battle';
import format from '@/utils/functions/format';

interface IRewardBattle {
    money: number;
    xp: number;
}

interface WinBattleBlockProps {
    enemyPokemon: IPokemon;
    allyPokemon: IPokemon;
    onExploreAgain: () => void;
    onLevelUped: () => void;
}

export const WinBattleBlock = ({ enemyPokemon, allyPokemon, onExploreAgain, onLevelUped }: WinBattleBlockProps) => {
    const [reward, setReward] = useState<IRewardBattle>({ money: 0, xp: 0 });
    const player = useSelector((state: RootState) => state.player!);
    const dispatch = useDispatch();

    const onBack = () => {
        dispatch(resetBattleState());
    };

    const handleWinBattle = () => {
        const rewardsBattle = getRewardsBattle({ allyPokemon, enemyPokemon, result: 'win' });
        const isLevelUp = allyPokemon.stats.xp.current + rewardsBattle.exp >= allyPokemon.stats.xp.total;

        setReward({
            money: rewardsBattle.money,
            xp: rewardsBattle.exp
        });

        dispatch(addExpPlayerPokemon({ expGained: rewardsBattle.exp, pokemonId: allyPokemon.id }));
        dispatch(addBattleLog(`Parabéns, você ganhou **${format.money(rewardsBattle.money)}** por ter derrotado {enemy}!`));
        dispatch(addBattleLog(`{ally} ganhou **${rewardsBattle.exp} de experiência**!`));
        dispatch(setPlayerMoney(player.inventory.money + rewardsBattle.money));
        dispatch(
            setPlayerFightStatistics({
                ...player.statistics.fight,
                total: player.statistics.fight.total + 1,
                wins: player.statistics.fight.wins + 1
            })
        );

        if (isLevelUp) {
            onLevelUped();
        }
    };

    useEffect(() => {
        handleWinBattle();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='absolute left-0 top-0 h-full w-full rounded-box bg-base-100/90 p-6'>
            <div className='flex h-full w-full flex-col items-center justify-center overflow-hidden'>
                <span>
                    Parabéns, você ganhou <strong className='text-lime-500'>{format.money(reward.money)}</strong>
                </span>
                <span className='mb-2'>
                    por ter derrotado <strong>{enemyPokemon.name}</strong>
                </span>
                <button onClick={onExploreAgain} className='btn btn-primary btn-sm mt-3 px-4'>
                    Procurar outra vez
                </button>
                <button onClick={onBack} className='btn btn-ghost btn-sm mt-3 px-4 text-base-content'>
                    Voltar
                </button>
            </div>
        </div>
    );
};
