import { useSelector } from 'react-redux';
import { FaChevronRight, FaStar } from 'react-icons/fa6';

import { RootState } from '@/store';
import { Avatar } from '@/components/Avatar';
import { IPokemon } from '@/types/pokemon';
import { useRef } from 'react';
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';

interface ChoicePokemonBlockProps {
    onPokemonSelect: (pokemon: IPokemon) => void;
}

export const ChoicePokemonBlock = ({ onPokemonSelect }: ChoicePokemonBlockProps) => {
    const player = useSelector((state: RootState) => state.player);
    const pokemonListRef = useRef<HTMLDivElement>(null);

    const scrollPokemonList = (side: 'left' | 'right') => {
        const deltaScroll = side === 'left' ? -500 : 500;
        const currentScroll = pokemonListRef.current?.scrollLeft || 0;

        pokemonListRef.current?.scrollTo(currentScroll + deltaScroll, 0);
    };

    return (
        <div>
            <div className='flex w-full justify-between'>
                <span className='flex items-center text-sm'>Escolha um pokémon</span>
                <div className='flex items-center'>
                    <button className='btn btn-circle btn-ghost btn-sm'>
                        <FaArrowCircleLeft size={20} onClick={() => scrollPokemonList('left')} />
                    </button>
                    <button className='btn btn-circle btn-ghost btn-sm'>
                        <FaArrowCircleRight size={20} onClick={() => scrollPokemonList('right')} />
                    </button>
                </div>
            </div>
            <div className='custom-scroll-x overflow-x-auto overflow-y-hidden scroll-smooth py-2' ref={pokemonListRef}>
                <div className='flex gap-2'>
                    {player?.pokemons.map((pokemon) => (
                        <div
                            key={pokemon.id}
                            onClick={() => onPokemonSelect(pokemon)}
                            className='relative flex w-52 min-w-52 animate-pulse cursor-pointer items-center gap-1 overflow-hidden rounded-btn border border-neutral text-center transition-all hover:scale-105'
                        >
                            <div className='w-[64px] min-w-[64px]'>
                                <Avatar src={pokemon.sprite} alt={pokemon.name} color={pokemon.color} bgRadius={60} size={64} />
                            </div>
                            <div>
                                <span className='text-sm font-bold'>{pokemon.name}</span>
                                <div className='flex w-fit items-center gap-1 rounded-badge border border-neutral px-2 py-1 text-xs font-bold'>
                                    <FaStar className='text-amber-400' />
                                    Lv {pokemon.level}
                                </div>
                            </div>
                            <FaChevronRight className='absolute bottom-1/2 right-2 translate-y-1/2 text-neutral-content/25' />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
