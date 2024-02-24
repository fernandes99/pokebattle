import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '@/store';
import { addBattleLog, resetBattleState } from '@/store/reducers/battle';
import { addExpPlayerPokemon, setPlayerFightStatistics, setPlayerMoney } from '@/store/reducers/player';
import { IPokemon } from '@/types/pokemon';
import format from '@/utils/functions/format';
import { getRewardsBattle } from '@/utils/functions/battle';

interface IRewardBattle {
    money: number;
    xp: number;
}

interface LoseBattleBlockProps {
    enemyPokemon: IPokemon;
    allyPokemon: IPokemon;
    onExploreAgain: () => void;
    onLevelUped: () => void;
}

export const LoseBattleBlock = ({ enemyPokemon, allyPokemon, onExploreAgain, onLevelUped }: LoseBattleBlockProps) => {
    const [reward, setReward] = useState<IRewardBattle>({ money: 0, xp: 0 });
    const player = useSelector((state: RootState) => state.player!);
    const dispatch = useDispatch();

    const onBack = () => {
        dispatch(resetBattleState());
    };

    const handleLoseBattle = () => {
        const rewardsBattle = getRewardsBattle({ allyPokemon, enemyPokemon, result: 'lose' });
        const isLevelUp = allyPokemon.stats.xp.current + rewardsBattle.exp >= allyPokemon.stats.xp.total;

        console.log('LOSE BATTLE');

        setReward({
            money: rewardsBattle.money,
            xp: rewardsBattle.exp
        });

        dispatch(addExpPlayerPokemon({ expGained: rewardsBattle.exp, pokemonId: allyPokemon.id }));
        dispatch(addBattleLog(`Que pena, você foi derrotado por {enemy} e perdeu **${format.money(Math.abs(rewardsBattle.money))}**.`));
        dispatch(addBattleLog(`{ally} ganhou **${rewardsBattle.exp} de experiência**!`));
        dispatch(setPlayerMoney(player.inventory.money + rewardsBattle.money));
        dispatch(
            setPlayerFightStatistics({
                ...player.statistics.fight,
                total: player.statistics.fight.total + 1,
                loses: player.statistics.fight.loses + 1
            })
        );

        if (isLevelUp) {
            onLevelUped();
        }
    };

    useEffect(() => {
        handleLoseBattle();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='absolute left-0 top-0 h-full w-full rounded-box bg-base-100/90 p-6'>
            <div className='flex h-full w-full flex-col items-center justify-center overflow-hidden'>
                <span>Que pena, você foi derrotado</span>
                <span className='mb-2'>
                    por <strong>{enemyPokemon.name}</strong> e perdeu
                    <strong className='text-warning'> {format.money(Math.abs(reward!.money))}</strong>
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
