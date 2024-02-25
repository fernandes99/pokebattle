import { useSelector } from 'react-redux';
import { FaInfo, FaStar } from 'react-icons/fa6';

import { Avatar } from '@/components/Avatar';
import { IPokemon, IPokemonMove } from '@/types/pokemon';
import { Progress } from '@/components/Progress';
import { RootState } from '@/store';

interface PokemonPlayerBlockProps {
    pokemon: IPokemon;
    onAttack: (move: IPokemonMove) => void;
}

export const PokemonPlayerBlock = ({ pokemon, onAttack }: PokemonPlayerBlockProps) => {
    const battle = useSelector((state: RootState) => state.battle);
    const onAllyAttack = battle.status === 'on-ally-attack';
    const onEnemyAttack = battle.status === 'on-enemy-attack';
    const blockActions = battle.round === 'enemy' || onAllyAttack;

    return (
        <div className='flex w-full items-center gap-2 pr-2'>
            <div className={`${onAllyAttack ? 'animate-attack-bottom' : ''} ${onEnemyAttack ? 'animate-injure' : ''}`}>
                <Avatar src={pokemon.sprite} alt={pokemon.name} color={pokemon.color} bgRadius={60} />
            </div>
            <div className='flex flex-1 flex-col gap-2'>
                <div className='flex gap-2'>
                    <span className='text-lg font-bold'>{pokemon.name}</span>
                    <div className='flex w-fit items-center gap-1 rounded-badge border border-neutral px-2 py-1 text-xs font-bold'>
                        <FaStar className='text-amber-400' />
                        Lv {pokemon.level}
                    </div>
                </div>
                <Progress max={pokemon.stats.hp.total} value={pokemon.stats.hp.current} />
                <div className={`${blockActions ? 'pointer-events-none opacity-30' : ''}`}>
                    <span className='text-xs'>Ataques:</span>
                    <div className='grid grid-cols-2 gap-1'>
                        {pokemon.moves.map((move, index) => (
                            <div className='relative flex w-full cursor-pointer select-none flex-col gap-1' key={index}>
                                <div
                                    onClick={() => onAttack(move)}
                                    className='flex cursor-pointer justify-between rounded-btn border border-neutral transition-all hover:scale-[1.01]'
                                >
                                    <div className='px-3 py-1'>
                                        <div className='tooltip -ml-2 mr-1' data-tip={move.description}>
                                            <button className='btn btn-circle btn-ghost btn-xs'>
                                                <FaInfo className='opacity-40' />
                                            </button>
                                        </div>
                                        <span className='text-sm'>{move.title}</span>
                                    </div>
                                    <div
                                        className='flex items-center rounded-btn border px-2'
                                        style={{
                                            borderColor: `${move.type.color}50`
                                        }}
                                    >
                                        <span className='text-[12px] font-medium' style={{ color: move.type.color }}>
                                            {move.type.title}
                                        </span>
                                    </div>
                                </div>
                                <div className='tooltip mx-1 flex h-[6px]' data-tip='Indicador de dano'>
                                    <progress className='progress progress-secondary h-[2px] w-full' value={move.power} max='100' />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
