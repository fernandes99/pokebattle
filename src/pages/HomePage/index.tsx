import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootState } from '@/store';
import { setPlayer } from '@/store/reducers/player';
import { Navigation } from '@/components/Navigation';
import StatisticBlock from './components/StatisticBlock';
import InventoryBlock from './components/InventoryBlock';
import PokemonsBlock from './components/PokemonsBlock';
import ArenaBlock from './components/ArenaBlock';
import InfoBattleBlock from './components/InfoBattleBlock';
import storage from '@/utils/functions/storage';
import HubSong from '@/assets/sounds/song-hub.mp3';

const SOUND = new Audio(HubSong);
SOUND.volume = 0.2;
SOUND.loop = true;

function HomePage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const player = useSelector((state: RootState) => state.player);
    const [isSoundPlaying, setIsSoundPlaying] = useState(false);
    console.log(player);

    const handleMouseClick = useCallback(() => {
        if (!isSoundPlaying) {
            SOUND.remove();
            SOUND.play();
            setIsSoundPlaying(true);
        }
    }, [isSoundPlaying]);

    const verifyPlayer = useCallback(() => {
        const player = storage.get('player_data');

        if (player) {
            return dispatch(setPlayer(JSON.parse(player)));
        }

        return navigate('/bem-vindo');
    }, [navigate, dispatch]);

    useEffect(() => {
        verifyPlayer();
        document.addEventListener('click', handleMouseClick);

        return () => {
            document.removeEventListener('click', handleMouseClick);
        };
    }, [verifyPlayer, handleMouseClick]);

    useEffect(() => {
        storage.set('player_data', JSON.stringify(player));
    }, [player]);

    return (
        <div className='flex h-dvh w-dvw flex-col items-center justify-center gap-4 bg-base-300 p-6'>
            <Navigation />
            <div className='container flex w-fit items-center justify-center rounded-box bg-base-100 p-6 shadow-lg'>
                <div className='flex h-[512px] gap-3'>
                    <div className='flex w-[624px] min-w-[524px] flex-col gap-3'>
                        <ArenaBlock />
                        <InfoBattleBlock />
                    </div>
                    <div className='flex min-w-[250px] flex-col gap-3'>
                        <StatisticBlock />
                        <InventoryBlock />
                    </div>
                    <div className='flex h-full min-w-[150px] flex-col gap-3'>
                        <PokemonsBlock />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
