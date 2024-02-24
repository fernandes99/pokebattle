import { ReactNode, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import reactStringReplace from 'react-string-replace';

import { RootState } from '@/store';

function InfoBattleBlock() {
    const battle = useSelector((state: RootState) => state.battle);
    const logsContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logsContainerRef.current) {
            logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
        }
    }, [battle.logs]);

    return (
        <div className='relative h-[200px] rounded-box border border-neutral pb-4 pl-6 pr-4 pt-6'>
            <span className='absolute -top-3 left-4 bg-base-100 px-2 py-1 text-sm font-medium'>Informações da Batalha</span>

            <div ref={logsContainerRef} className='flex h-full flex-col gap-1 overflow-auto'>
                {battle.logs.map((log, index) => {
                    let logFormated: ReactNode[];

                    logFormated = reactStringReplace(log, '{enemy}', () => (
                        <strong
                            key={Math.random()}
                            style={{
                                color: battle.pokemon.enemy?.color,
                                filter: `drop-shadow(0px 2px 5px ${battle.pokemon.enemy?.color}80)`
                            }}
                        >
                            {battle.pokemon.enemy?.name}
                        </strong>
                    ));

                    logFormated = reactStringReplace(logFormated, '{ally}', () => (
                        <strong
                            key={Math.random()}
                            style={{
                                color: battle.pokemon.ally?.color,
                                filter: `drop-shadow(0px 2px 5px ${battle.pokemon.ally?.color}80)`
                            }}
                        >
                            {battle.pokemon.ally?.name}
                        </strong>
                    ));

                    logFormated = reactStringReplace(logFormated, /\*\*(.*?)\*\*/g, (match) => (
                        <strong key={Math.random()} className='rounded-md font-bold'>
                            {match}
                        </strong>
                    ));

                    return <span key={index}>{logFormated}</span>;
                })}
            </div>
        </div>
    );
}

export default InfoBattleBlock;
