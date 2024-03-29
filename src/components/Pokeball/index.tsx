import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '@/store';

import pokeballWobble from '@/assets/sounds/pokeball-wobble.mp3';
import pokeballSuccess from '@/assets/sounds/pokeball-success.mp3';
import pokeballLost from '@/assets/sounds/pokeball-lost.mp3';

import './styles.css';

// Credits SVG: https://codepen.io/borntofrappe/pen/zgYgKp

export const Pokeball = () => {
    const status = useSelector((state: RootState) => state.battle.status);
    const [pokeballState, setPokeballState] = useState<'catching' | 'success' | 'failure'>('catching');

    const handlePokeballSound = (audio: string, playbackRate = 1) => {
        const pokeballSound = new Audio(audio);

        pokeballSound.playbackRate = playbackRate;
        pokeballSound.play();
    };

    useEffect(() => {
        if (status === 'pokemon-catched') {
            handlePokeballSound(pokeballSuccess);
            return setPokeballState('success');
        }

        if (status === 'pokemon-catching') {
            handlePokeballSound(pokeballWobble, 2);
            return setPokeballState('catching');
        }

        if (status === 'pokemon-lost') {
            handlePokeballSound(pokeballLost);
            return setPokeballState('failure');
        }
    }, [status]);

    return (
        <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-box bg-base-100/90 p-6'>
            <svg
                viewBox='0 0 100 100'
                width='120'
                height='120'
                className={`${pokeballState} ${pokeballState === 'catching' ? 'animate-pulse' : ''}`}
                id='pokeball'
            >
                <g transform='translate(50 50) scale(0.8)'>
                    <g className='stars' transform='scale(0)'>
                        <path
                            fill='#cfc52d'
                            stroke='#cfc52d'
                            strokeWidth='3'
                            strokeLinejoin='round'
                            strokeLinecap='round'
                            d='M -50 -50 l 4.5 0 l 2.5 -4.5 l 2.5 4.5 l 4.5 0 l -3.5 3.5 l 1.5 5 l -5 -2.5 l -5 2.5 l 1.5 -5 l -3.5 -3.5'
                        />
                        <path
                            fill='#cfc52d'
                            stroke='#cfc52d'
                            strokeWidth='3'
                            strokeLinejoin='round'
                            strokeLinecap='round'
                            d='M 36 -50 l 4.5 0 l 2.5 -4.5 l 2.5 4.5 l 4.5 0 l -3.5 3.5 l 1.5 5 l -5 -2.5 l -5 2.5 l 1.5 -5 l -3.5 -3.5'
                        />
                    </g>
                    <g transform='translate(0 50)'>
                        <g className='gravity'>
                            <g transform='translate(0 -50)'>
                                <g className='ball' transform='scale(1 1)'>
                                    <g className='bottom'>
                                        <path fill='#ffffff' stroke='#303030' strokeWidth='5' d='M -47.5 0 a 47.5 47.5 0 0 0 95 0z'></path>
                                    </g>
                                    <g className='top'>
                                        <path fill='#f15d5f' d='M -47.5 0 a 47.5 47.5 0 0 1 95 0'></path>
                                        <path
                                            fill='none'
                                            stroke='#ffffff'
                                            strokeWidth='5'
                                            strokeLinecap='round'
                                            strokeDasharray='0 15 9 9 20 100'
                                            d='M -38 -0 a 38 38 0 0 1 76 0'
                                        ></path>
                                        <path fill='none' stroke='#303030' strokeWidth='5' d='M -47.5 0 a 47.5 47.5 0 0 1 95 0z'></path>
                                    </g>

                                    <g className='open' transform='scale(1 0)'>
                                        <path
                                            fill='#303030'
                                            stroke='#303030'
                                            strokeWidth='5'
                                            strokeLinejoin='round'
                                            d='M -47.5 -10 a 190 190 0 0 1 95 0 a 190 190 0 0 1 -95 0'
                                        ></path>
                                        <path
                                            fill='#303030'
                                            stroke='#303030'
                                            strokeWidth='5'
                                            strokeLinejoin='round'
                                            d='M -47.5 5 a 160 160 0 0 0 95 0 a 180 180 0 0 0 -95 0'
                                        ></path>
                                    </g>

                                    <g className='center'>
                                        <circle fill='#ffffff' stroke='#303030' strokeWidth='5' cx='0' cy='0' r='12'></circle>
                                        <circle fill='#ffffff' stroke='#303030' strokeWidth='3' cx='0' cy='0' r='6'></circle>
                                        <g className='inner' opacity='0'>
                                            <circle fill='#f15d5f' cx='0' cy='0' r='4.5'></circle>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    );
};
