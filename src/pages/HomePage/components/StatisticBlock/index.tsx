import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { getWinRate } from '@/utils/functions/number';

function StatisticBlock() {
    const player = useSelector((state: RootState) => state.player);

    return (
        <div className='relative flex h-fit flex-col gap-2 rounded-box border border-neutral p-6'>
            <span className='absolute -top-3 left-4 bg-base-100 px-2 py-1 text-sm font-medium'>Estatísticas</span>

            {player ? (
                <>
                    <div className='flex justify-between text-sm'>
                        <span className='opacity-75'>Nome</span>
                        <span className='font-medium'>{player.name}</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                        <span className='opacity-75'>Lutas</span>
                        <span className='font-medium'>{player.statistics.fight.total}</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                        <span className='opacity-75'>Vitórias</span>
                        <span className='font-medium'>{player.statistics.fight.wins}</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                        <span className='opacity-75'>Derrotas</span>
                        <span className='font-medium'>{player.statistics.fight.loses}</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                        <span className='opacity-75'>Taxa de Vitórias</span>
                        <span className='font-medium'>{getWinRate(player.statistics.fight.wins, player.statistics.fight.loses)}%</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                        <span className='opacity-75'>Pokedéx</span>
                        <span className='font-medium'>{player.pokemons.length} de 700</span>
                    </div>
                </>
            ) : (
                <span className='loading loading-spinner mx-auto text-primary' />
            )}
        </div>
    );
}

export default StatisticBlock;
