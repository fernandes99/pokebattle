import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import { RootState } from '@/store';
import { IPokemon, IPokemonMove } from '@/types/pokemon';
import { IResponsePokemonMove } from '@/types/pokeApiResponses';
import { getMovePokemon, getPokemon, getPokemonMoves, playSound } from '@/utils/functions/general';
import { getPercentage, getRandomIntFromInterval } from '@/utils/functions/number';
import {
    addBattleLog,
    passRound,
    resetBattleState,
    setBattleStatus,
    setPokemonEnemy,
    setPokemonEnemyCaptureRate,
    setPokemonEnemyCurrentHp,
    setPokemonPlayer,
    setPokemonPlayerCurrentHp
} from '@/store/reducers/battle';
import { ExploreBlock } from './ExploreBlock';
import { PokemonPlayerBlock } from './PokemonPlayerBlock';
import { ChoicePokemonBlock } from './ChoicePokemonBlock';
import { PokemonEnemyBlock } from './PokemonEnemyBlock';
import { DELTA_DAMAGE, MAX_RANDOM_MULTIPLICATOR_DAMAGE, MIN_RANDOM_MULTIPLICATOR_DAMAGE } from '@/constants/deltas';
import { addPlayerMovePokemon, replacePlayerPokemon, updatePlayerMovePokemon } from '@/store/reducers/player';
import { Avatar } from '@/components/Avatar';
import { Pokeball } from '@/components/Pokeball';
import toast from 'react-hot-toast';
import { PokemonCatchedBlock } from './PokemonCatchedBlock';
import { LoseBattleBlock } from './LoseBattleBlock';
import { WinBattleBlock } from './WinBattleBlock';
import { getDamageVariants } from '@/utils/functions/battle';
import { IDamageVariants } from '@/types/battle';

interface ISwitchMove {
    oldMove: IPokemonMove;
    newMove: IResponsePokemonMove;
}

interface IChoiceNewMove {
    move: IResponsePokemonMove | null;
    showMoveToChoice: boolean;
    loading?: boolean;
}

function ArenaBlock() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [choiceNewMove, setChoiceNewMove] = useState<IChoiceNewMove>({ move: null, showMoveToChoice: false, loading: false });
    const battle = useSelector((state: RootState) => state.battle);
    battle.pokemon.enemy && console.log('Enemy', battle.pokemon.enemy);
    battle.pokemon.ally && console.log('Ally', battle.pokemon.ally);

    const selectPokemon = (pokemon: IPokemon) => {
        dispatch(addBattleLog(`Você enviou {ally} para batalhar!`));
        dispatch(setPokemonPlayer(pokemon));
    };

    const switchMove = async ({ oldMove, newMove }: ISwitchMove) => {
        setChoiceNewMove({ ...choiceNewMove, loading: true });
        try {
            const newMoveFormated = await getMovePokemon(newMove.move.url);
            dispatch(updatePlayerMovePokemon({ pokemonId: battle.pokemon.ally!.id, oldMove, newMove: newMoveFormated }));
            toast.success('Habilidade trocada!');
        } finally {
            setChoiceNewMove({ move: null, showMoveToChoice: false, loading: false });
        }
    };

    const addNewMove = useCallback(
        async (newMove: IResponsePokemonMove) => {
            const allyPokemon = battle.pokemon.ally!;
            const newMoveFormated = await getMovePokemon(newMove.move.url);

            dispatch(addPlayerMovePokemon({ pokemonId: allyPokemon.id, newMove: newMoveFormated }));
        },
        [dispatch, battle.pokemon.ally]
    );

    const handlePokemonLevelUp = useCallback(async () => {
        const allyPokemon = battle.pokemon.ally!;
        const newLevel = allyPokemon.level + 1; // TODO
        const isEvolution = allyPokemon.evolution.minLevel && newLevel >= allyPokemon.evolution.minLevel;

        if (isEvolution) {
            const pokemonEvolved = await getPokemon({
                name: allyPokemon.evolution.to!.name,
                level: newLevel
            });

            dispatch(replacePlayerPokemon({ pokemonEvolved: pokemonEvolved, pokemonOldId: allyPokemon.id }));
        }

        const pokemonMoves = await getPokemonMoves(allyPokemon.id);
        const newMoves = pokemonMoves.filter((move) => move.version_group_details[0].level_learned_at === newLevel);

        if (newMoves.length) {
            return allyPokemon.moves.length >= 4
                ? setChoiceNewMove({ move: newMoves[0], showMoveToChoice: true, loading: false })
                : addNewMove(newMoves[0]);
        }
    }, [dispatch, battle.pokemon.ally, addNewMove]);

    const calculateDamage = useCallback(
        (move: IPokemonMove, pokemonAttacker: IPokemon, pokemonTarget: IPokemon, damageVariants: IDamageVariants) => {
            const { isCritical, multiplicatorByType } = damageVariants;

            const getDamageByClass = () => {
                if (move.classDamage === 'physical') return pokemonAttacker.stats.attack.current;
                if (move.classDamage === 'special') return pokemonAttacker.stats.specialAttack.current;
                return 0;
            };

            const getDefenseByClass = () => {
                if (move.classDamage === 'physical') return pokemonTarget.stats.defense.current;
                if (move.classDamage === 'special') return pokemonTarget.stats.specialDefense.current;
                return 1; // prevent NaN (0/0=NaN)
            };

            let damage = ((move.power / DELTA_DAMAGE) * getDamageByClass()) / getDefenseByClass();
            damage = damage * multiplicatorByType;

            if (isCritical) damage = damage * 2;

            return getRandomIntFromInterval(damage * MIN_RANDOM_MULTIPLICATOR_DAMAGE, damage * MAX_RANDOM_MULTIPLICATOR_DAMAGE);
        },
        [dispatch]
    );

    const handleBattleAttack = useCallback(
        (isEnemyAttack: boolean, move: IPokemonMove, currentHp: number, damage: number, damageVariants: IDamageVariants) => {
            const { isCritical, multiplicatorByType } = damageVariants;
            const pokemonEnemy = battle.pokemon.enemy!;
            const pokemonAlly = battle.pokemon.ally!;
            const updateRate = () => {
                const hpPercentage = getPercentage(currentHp, pokemonEnemy.stats.hp.total);

                if (hpPercentage <= 5) return dispatch(setPokemonEnemyCaptureRate(pokemonEnemy.captureRate * 3));
                if (hpPercentage <= 20) return dispatch(setPokemonEnemyCaptureRate(pokemonEnemy.captureRate * 2));
                if (hpPercentage <= 50) return dispatch(setPokemonEnemyCaptureRate(pokemonEnemy.captureRate * 1.3));
                if (hpPercentage <= 90) return dispatch(setPokemonEnemyCaptureRate(pokemonEnemy.captureRate * 1.1));
            };

            if (isEnemyAttack) {
                dispatch(setPokemonPlayerCurrentHp(currentHp));
                dispatch(addBattleLog(`{enemy} usou **${move.title}**`));
                dispatch(addBattleLog(`{enemy} causou **${damage} de dano** em {ally}`));

                if (move.drain) {
                    const drainValue = damage / 2;
                    dispatch(addBattleLog(`{enemy} drenou **${drainValue}** de {ally}`));
                    dispatch(setPokemonEnemyCurrentHp(pokemonEnemy.stats.hp.current + drainValue));
                }
            } else {
                dispatch(setPokemonEnemyCurrentHp(currentHp));
                dispatch(addBattleLog(`{ally} usou **${move.title}**`));
                dispatch(addBattleLog(`{ally} causou **${damage} de dano** em {enemy}`));
                updateRate();

                if (move.drain) {
                    const drainValue = damage / 2;
                    dispatch(addBattleLog(`{ally} drenou **${drainValue}** de {enemy}`));
                    dispatch(setPokemonPlayerCurrentHp(pokemonAlly.stats.hp.current + drainValue));
                }
            }

            if (isCritical) dispatch(addBattleLog(`**Acerto crítico!**`));
            if (multiplicatorByType === 2) dispatch(addBattleLog('Isso foi super efetivo!'));
            if (multiplicatorByType <= 0.5) dispatch(addBattleLog('Isso não foi nada efetivo!'));

            return dispatch(passRound());
        },
        [dispatch, battle]
    );

    const attack = useCallback(
        (move: IPokemonMove, isEnemyAttack = false) => {
            const pokemonAttacker = isEnemyAttack ? battle.pokemon.enemy : battle.pokemon.ally;
            const pokemonTarget = !isEnemyAttack ? battle.pokemon.enemy : battle.pokemon.ally;

            if (!pokemonAttacker || !pokemonTarget) return;

            const damageVariants = getDamageVariants({ move, pokemonAttacker, pokemonTarget });
            const damage = calculateDamage(move, pokemonAttacker, pokemonTarget, damageVariants);
            const currentHp = pokemonTarget.stats.hp.current - damage;

            if (currentHp <= 0) {
                if (isEnemyAttack) {
                    return dispatch(setBattleStatus('lose'));
                }

                return dispatch(setBattleStatus('win'));
            }

            return handleBattleAttack(isEnemyAttack, move, currentHp, damage, damageVariants);
        },
        [dispatch, calculateDamage, handleBattleAttack, battle]
    );

    const explore = async () => {
        setLoading(true);
        dispatch(resetBattleState());

        getPokemon({ level: getRandomIntFromInterval(1, 10) })
            .then((wildPokemon) => {
                playSound({ url: wildPokemon.sound });
                dispatch(setPokemonEnemy(wildPokemon));
                dispatch(addBattleLog(`Um {enemy} selvagem apareceu. O que você vai fazer?`));
            })
            .finally(() => setLoading(false));
    };

    useMemo(() => {
        if (battle.round === 'enemy' && battle.status === 'in-progress') {
            setTimeout(() => {
                if (battle.pokemon.enemy) {
                    const moves = battle.pokemon.enemy.moves;
                    attack(moves[getRandomIntFromInterval(0, moves.length - 1)], true);
                }
            }, 1000);
        }
    }, [battle, attack]);

    return (
        <div className='relative flex h-[300px] flex-col gap-2 rounded-box border border-neutral p-6'>
            <span className='absolute -top-3 left-4 z-10 bg-base-100 px-2 py-1 text-sm font-medium'>Arena</span>

            {loading ? (
                <span className='loading loading-spinner m-auto text-primary' />
            ) : (
                <>
                    {battle.pokemon.enemy ? (
                        <div className='flex h-full flex-col justify-between'>
                            {battle.pokemon.ally ? (
                                <PokemonPlayerBlock pokemon={battle.pokemon.ally} onAttack={attack} />
                            ) : (
                                <ChoicePokemonBlock onPokemonSelect={selectPokemon} />
                            )}
                            <PokemonEnemyBlock pokemon={battle.pokemon.enemy} />
                        </div>
                    ) : (
                        <ExploreBlock onExplore={explore} />
                    )}
                </>
            )}

            {battle.status.includes('pokemon') && <Pokeball />}

            {battle.status === 'win' && (
                <WinBattleBlock
                    enemyPokemon={battle.pokemon.enemy!}
                    allyPokemon={battle.pokemon.ally!}
                    onExploreAgain={explore}
                    onLevelUped={handlePokemonLevelUp}
                />
            )}

            {battle.status === 'lose' && (
                <LoseBattleBlock
                    enemyPokemon={battle.pokemon.enemy!}
                    allyPokemon={battle.pokemon.ally!}
                    onExploreAgain={explore}
                    onLevelUped={handlePokemonLevelUp}
                />
            )}

            {battle.status === 'pokemon-catched' && !!battle.pokemon.enemy && (
                <PokemonCatchedBlock pokemonCatched={battle.pokemon.enemy} onExploreAgain={explore} />
            )}

            {!!choiceNewMove.move && battle.pokemon.ally && (
                <div className='absolute left-0 top-0 h-full w-full rounded-box bg-base-100 p-6'>
                    <div className='flex h-full w-full flex-col items-center justify-center overflow-hidden'>
                        <Avatar src={battle.pokemon.ally.sprite} alt={battle.pokemon.ally.name} color={battle.pokemon.ally.color} />
                        <span>
                            {battle.pokemon.ally?.name} está aprendendo <b>{choiceNewMove.move.move.name}</b>
                        </span>
                        {choiceNewMove.showMoveToChoice ? (
                            <div className='flex flex-col justify-center gap-2 text-center'>
                                <p>Qual habilidade quer substituir?</p>
                                <ul className='grid grid-cols-2 items-center justify-center gap-2'>
                                    {battle.pokemon.ally.moves.map((move) => (
                                        <li
                                            onClick={() => switchMove({ oldMove: move, newMove: choiceNewMove.move! })}
                                            className='btn btn-outline btn-secondary btn-sm'
                                        >
                                            {move.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => setChoiceNewMove({ ...choiceNewMove, showMoveToChoice: true })}
                                    className='btn btn-primary btn-sm mt-3 px-4'
                                >
                                    Substituir uma habilidade
                                </button>
                                <button onClick={() => {}} className='btn btn-ghost btn-sm mt-3 px-4 text-base-content'>
                                    Esquecer habilidade
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ArenaBlock;
