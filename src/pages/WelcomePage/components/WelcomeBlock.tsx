import { ChangeEvent, useState } from 'react';

interface IWelcomeBlock {
    onStartGame: (userName: string) => void;
}

function WelcomeBlock({ onStartGame }: IWelcomeBlock) {
    const [userName, setUserName] = useState('');

    const handleInputUserName = (event: ChangeEvent<HTMLInputElement>) => {
        setUserName(event.target.value);
    };

    const startGame = () => {
        onStartGame(userName);
    };

    return (
        <div>
            <p className='text-center'>Bem vindo ao</p>
            <h1 className='mb-4 text-center text-4xl text-primary'>
                Poke<strong>Battle</strong>
            </h1>
            <input
                type='text'
                className='input input-bordered mb-4 w-full'
                placeholder='Insira seu nome'
                onChange={handleInputUserName}
                required
            />

            <div className='tooltip w-full' data-tip={userName.length < 1 ? 'Você deve preencher seu nome primeiro' : null}>
                <button className='btn btn-primary w-full rounded-btn' disabled={!userName} onClick={startGame}>
                    Jogar
                </button>
            </div>
            <span className='mt-4 flex w-full justify-center text-sm'>
                Presisone <kbd className='kbd kbd-sm mx-1'>Enter</kbd> para jogar.
            </span>
        </div>
    );
}

export default WelcomeBlock;
