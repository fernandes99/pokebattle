import { useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';

import { RootState } from '@/store';
import { Avatar } from '@/components/Avatar';
import { getPercentage } from '@/utils/functions/number';

function PokemonsBlock() {
    const player = useSelector((state: RootState) => state.player);

    return (
        <div className='relative flex h-full flex-col rounded-box border border-neutral p-2 px-1'>
            <span className='absolute -top-3 left-4 bg-base-100 px-2 py-1 text-sm font-medium'>Pokémons</span>

            {player ? (
                <div className='grid grid-cols-2 gap-1 overflow-x-hidden pb-3'>
                    {player.pokemons.map((pokemon) => (
                        <div
                            key={pokemon.id}
                            onClick={() => {}}
                            className='group mx-auto flex cursor-pointer items-center rounded-btn text-center transition-all hover:scale-[1.02]'
                        >
                            <div className='flex w-[72px] flex-col items-center'>
                                <div className='tooltip tooltip-bottom' data-tip={`${pokemon.name}`}>
                                    <div className='group-hover:animate-pulse'>
                                        <div
                                            className='radial-progress absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral/75'
                                            role='progressbar'
                                            style={{
                                                // @ts-ignore
                                                '--value': `${getPercentage(pokemon.stats.xp.total - pokemon.stats.xp.base * pokemon.level - (pokemon.stats.xp.total - pokemon.stats.xp.current), pokemon.stats.xp.total - pokemon.stats.xp.base * pokemon.level)}`,
                                                '--size': '58px',
                                                '--thickness': '2px'
                                            }}
                                        />
                                        <Avatar src={pokemon.sprite} alt={pokemon.name} color={pokemon.color} size={72} />
                                    </div>
                                </div>
                                <div className='flex w-fit items-center gap-1 rounded-badge border border-neutral px-2 py-[2px] text-[11px] font-bold'>
                                    <FaStar className='text-amber-400' />
                                    Lv {pokemon.level}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <span className='loading loading-spinner mx-auto text-primary' />
            )}
        </div>
    );
}

export default PokemonsBlock;
