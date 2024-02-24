import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import WelcomeBlock from './components/WelcomeBlock';
import SelectPokemonBlock from './components/SelectPokemonBlock';
import { IPlayer } from '@/types/player';
import storage from '@/utils/functions/storage';
import { IPokemon } from '@/types/pokemon';

const INITIAL_PLAYER_DATA = {
    name: '',
    inventory: {
        money: 500,
        pokeballs: {
            simple: 5,
            great: 0,
            ultra: 0
        },
        potions: {
            simple: 5,
            super: 0,
            hyper: 0,
            max: 0
        }
    },
    pokemons: [],
    statistics: {
        fight: {
            total: 0,
            loses: 0,
            wins: 0
        }
    }
} as IPlayer;

function WelcomePage() {
    const navigate = useNavigate();
    const [showChoiceFirstPokemon, setShowChoiceFirstPokemon] = useState(false);
    const [userName, setUserName] = useState('');

    const handleSelectPokemon = (pokemonSelected: IPokemon) => {
        const playerData = {
            ...INITIAL_PLAYER_DATA,
            name: userName,
            pokemons: [pokemonSelected]
        } as IPlayer;

        storage.set('player_data', JSON.stringify(playerData));
        navigate('/');
    };

    const handleStartGame = (name: string) => {
        setUserName(name);
        setShowChoiceFirstPokemon(true);
    };

    return (
        <div className='flex h-dvh w-dvw items-center justify-center bg-base-300'>
            <div className='container flex max-w-lg items-center justify-center rounded-box bg-base-100 p-10 shadow-lg'>
                {showChoiceFirstPokemon ? (
                    <SelectPokemonBlock onSelectPokemon={handleSelectPokemon} />
                ) : (
                    <WelcomeBlock onStartGame={handleStartGame} />
                )}
            </div>
        </div>
    );
}

export default WelcomePage;
