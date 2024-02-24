import { useDispatch } from 'react-redux';
import { Avatar } from '@/components/Avatar';
import { IPokemon } from '@/types/pokemon';
import { resetBattleState } from '@/store/reducers/battle';

interface PokemonCatchedBlockProps {
    pokemonCatched: IPokemon;
    onExploreAgain: () => void;
}

export const PokemonCatchedBlock = ({ pokemonCatched, onExploreAgain }: PokemonCatchedBlockProps) => {
    const dispatch = useDispatch();

    const onBack = () => {
        dispatch(resetBattleState());
    };

    return (
        <div className='absolute left-0 top-0 h-full w-full animate-fade rounded-box bg-base-100/90 p-6 delay-1000'>
            <div className='flex h-full w-full flex-col items-center justify-center overflow-hidden'>
                <Avatar src={pokemonCatched.sprite} alt={pokemonCatched.name} color={pokemonCatched.color} />
                <span>Parabéns você conseguiu</span>
                <span className='mb-2'>
                    capturar <strong>{pokemonCatched.name}</strong>
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
