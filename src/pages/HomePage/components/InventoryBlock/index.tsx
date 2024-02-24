import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { RootState } from '@/store';
import format from '@/utils/functions/format';
import { getRandomIntFromInterval } from '@/utils/functions/number';
import { passRound, setBattleStatus } from '@/store/reducers/battle';
import { addPlayerPokemon, decreasePlayerPokeball } from '@/store/reducers/player';
import { sleep } from '@/utils/functions/general';

function InventoryBlock() {
    const dispatch = useDispatch();
    const player = useSelector((state: RootState) => state.player);
    const battle = useSelector((state: RootState) => state.battle);

    const usePokeball = async () => {
        const allyPokemon = battle.pokemon.ally!;
        const enemyPokemon = battle.pokemon.enemy!;

        if (battle.status !== 'in-progress' || !allyPokemon || !enemyPokemon) {
            return toast.error('Você deve estar em uma batalha para usar uma pokébola');
        }

        if (battle.round === 'enemy') {
            return toast.error('Não é a sua vez!');
        }

        if (!player?.inventory.pokeballs.simple) {
            return toast.error('Você não tem pokebolas para usar.');
        }

        dispatch(decreasePlayerPokeball());
        dispatch(setBattleStatus('pokemon-catching'));

        await sleep(3000);

        if (enemyPokemon.captureRate >= getRandomIntFromInterval(0, 100)) {
            dispatch(setBattleStatus('pokemon-catched'));
            dispatch(addPlayerPokemon(enemyPokemon));

            return toast.success(`Parabéns, você capturou ${enemyPokemon.name}`);
        }

        dispatch(setBattleStatus('pokemon-lost'));

        await sleep(500);
        toast.error(`Você não conseguiu capturar ${enemyPokemon.name}`);
        dispatch(passRound());
    };

    return (
        <div className='relative flex h-full flex-col gap-2 rounded-box border border-neutral p-6'>
            <span className='absolute -top-3 left-4 bg-base-100 px-2 py-1 text-sm font-medium'>Inventário</span>

            {player ? (
                <>
                    <div className='flex justify-between text-sm'>
                        <span className='opacity-75'>Dinheiro</span>
                        <span className='font-medium'>{format.money(player.inventory.money)}</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                        <div className='tooltip tooltip-left' data-tip={player.inventory.pokeballs.simple > 0 ? 'Usar pokébola' : null}>
                            <button
                                onClick={usePokeball}
                                className={`btn btn-link btn-sm h-full min-h-full p-0 opacity-75 hover:opacity-100`}
                            >
                                Pokébola
                            </button>
                        </div>
                        <span className='font-medium'>{player.inventory.pokeballs.simple}</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                        <div className='tooltip tooltip-left' data-tip={player.inventory.pokeballs.simple > 0 ? 'Usar pokébola' : null}>
                            <button onClick={usePokeball} className={`opacity-75 hover:opacity-100`}>
                                Super pokébola
                            </button>
                        </div>
                        <span className='font-medium'>{player.inventory.pokeballs.great}</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                        <div className='tooltip tooltip-left' data-tip={player.inventory.potions.simple > 0 ? 'Usar poção' : null}>
                            <button className={`btn btn-link btn-sm h-full min-h-full p-0 opacity-75 hover:opacity-100`}>Poção</button>
                        </div>
                        <span className='font-medium'>{player.inventory.potions.simple}</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                        <div className='tooltip tooltip-left' data-tip={player.inventory.potions.super > 0 ? 'Usar poção' : null}>
                            <button className={`opacity-75 hover:opacity-100`}>Super poção</button>
                        </div>
                        <span className='font-medium'>{player.inventory.potions.super}</span>
                    </div>
                </>
            ) : (
                <span className='loading loading-spinner mx-auto text-primary' />
            )}
        </div>
    );
}

export default InventoryBlock;
