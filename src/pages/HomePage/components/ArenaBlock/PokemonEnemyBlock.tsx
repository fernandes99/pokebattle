import { Avatar } from '@/components/Avatar';
import { IPokemon } from '@/types/pokemon';
import { FaStar } from 'react-icons/fa6';
import { Progress } from '@/components/Progress';

interface PokemonEnemyBlockProps {
    pokemon: IPokemon;
}

export const PokemonEnemyBlock = ({ pokemon }: PokemonEnemyBlockProps) => {
    return (
        <div className='flex w-full items-center gap-2 pr-2'>
            <Avatar src={pokemon.sprite} alt={pokemon.name} color={pokemon.color} bgRadius={60} />
            <div className='flex flex-1 flex-col gap-2'>
                <div className='flex gap-2'>
                    <span className='text-lg font-bold'>{pokemon.name}</span>
                    <div className='flex w-fit items-center gap-1 rounded-badge border border-neutral px-2 py-1 text-xs font-bold'>
                        <FaStar className='text-amber-400' />
                        Lv {pokemon.level}
                    </div>
                </div>
                <Progress max={pokemon.stats.hp.total} value={pokemon.stats.hp.current} />
            </div>
        </div>
    );
};
