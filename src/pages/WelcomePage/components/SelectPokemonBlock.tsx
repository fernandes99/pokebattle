import { Avatar } from '@/components/Avatar';
import { IPokemon } from '@/types/pokemon';
import { getPokemon, playSound } from '@/utils/functions/general';
import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface ISelectPokemonBlock {
    onSelectPokemon: (pokemonSelected: IPokemon) => void;
}

function SelectPokemonBlock({ onSelectPokemon }: ISelectPokemonBlock) {
    const [loading, setLoading] = useState(false);
    const [pokemons, setPokemons] = useState<IPokemon[] | null>(null);
    const [pokemonSelected, setPokemonSelected] = useState<IPokemon | null>(null);

    const fetchPokemons = async (ids: IPokemon['id'][]) => {
        const result = await Promise.all(ids.map((id) => getPokemon({ id })))
            .then((result) => result)
            .catch(() => null);

        return result;
    };

    const selectPokemon = (pokemon: IPokemon) => {
        setPokemonSelected(pokemon);
        playSound({ url: pokemon.sound });
    };

    const startGame = () => {
        onSelectPokemon(pokemonSelected!);
    };

    useEffect(() => {
        if (!pokemons?.length) {
            setLoading(true);
            fetchPokemons([1, 4, 7])
                .then(setPokemons)
                .finally(() => setLoading(false));
        }
    }, [pokemons]);

    return (
        <div>
            <p className='mb-6 text-center'>
                Escolha seu <b>primeiro pokémon</b>
            </p>
            <div className='flex items-center justify-center'>
                {loading ? (
                    <span className='loading loading-spinner py-4 text-primary' />
                ) : (
                    <div>
                        <div className='mb-6 grid grid-cols-3 gap-4'>
                            {pokemons?.map((pokemon) => {
                                const selected = pokemonSelected?.id === pokemon.id;

                                return (
                                    <div
                                        key={pokemon.id}
                                        onClick={() => selectPokemon(pokemon)}
                                        className={`flex cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-btn border border-neutral p-4 text-center transition-all hover:scale-105 ${selected ? 'scale-105' : 'animate-pulse'}`}
                                        style={{
                                            borderColor: selected ? `${pokemon.color}75` : ''
                                        }}
                                    >
                                        <Avatar src={pokemon.sprite} alt={pokemon.name} color={pokemon.color} />
                                        <span className='text-sm font-medium'>{pokemon.name}</span>
                                        <div className='flex items-center gap-1 rounded-badge border border-neutral px-2 py-1 text-xs font-bold'>
                                            <FaStar className='text-amber-400' />
                                            Lv {pokemon.level}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <button className='btn btn-primary w-full rounded-btn' disabled={!pokemonSelected} onClick={startGame}>
                            Vamos lá!
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SelectPokemonBlock;
