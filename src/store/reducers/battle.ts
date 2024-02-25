import { IBattle } from '@/types/battle';
import { IPokemon } from '@/types/pokemon';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
    logs: [],
    round: 'ally',
    status: 'in-progress',
    pokemon: {
        ally: null,
        enemy: null
    }
} as IBattle;

const battle = createSlice({
    name: 'battle',
    initialState: INITIAL_STATE,
    reducers: {
        setPokemonEnemy(state, action: PayloadAction<IPokemon>) {
            state.pokemon.enemy = action.payload;
        },
        setPokemonPlayer(state, action: PayloadAction<IPokemon>) {
            state.pokemon.ally = action.payload;
        },
        setPokemonEnemyCurrentHp(state, action: PayloadAction<IPokemon['stats']['hp']['current']>) {
            if (state.pokemon.enemy) {
                state.pokemon.enemy.stats.hp.current = action.payload;
            }
        },
        setPokemonPlayerCurrentHp(state, action: PayloadAction<IPokemon['stats']['hp']['current']>) {
            if (state.pokemon.ally) {
                state.pokemon.ally.stats.hp.current = action.payload;
            }
        },
        changePokemonEnemyStat(state, action: PayloadAction<{ stat: keyof IPokemon['stats']; value: number }>) {
            if (state.pokemon.enemy) {
                const currentStat = state.pokemon.enemy.stats[action.payload.stat].current;
                state.pokemon.enemy.stats[action.payload.stat].current = currentStat + action.payload.value;
            }
        },
        changePokemonAllyStat(state, action: PayloadAction<{ stat: keyof IPokemon['stats']; value: number }>) {
            if (state.pokemon.ally) {
                const currentStat = state.pokemon.ally.stats[action.payload.stat].current;
                state.pokemon.ally.stats[action.payload.stat].current = currentStat + action.payload.value;
            }
        },
        setPokemonEnemyCaptureRate(state, action: PayloadAction<IPokemon['captureRate']>) {
            if (state.pokemon.enemy) {
                state.pokemon.enemy.captureRate = action.payload;
            }
        },
        setBattleStatus(state, action: PayloadAction<IBattle['status']>) {
            state.status = action.payload;
        },
        passRound(state) {
            state.status = 'in-progress';
            state.round = state.round === 'ally' ? 'enemy' : 'ally';
        },
        addBattleLog(state, action: PayloadAction<string>) {
            state.logs.push(action.payload);
        },
        resetBattleState() {
            return INITIAL_STATE;
        }
    }
});

export const {
    addBattleLog,
    setPokemonEnemy,
    setPokemonPlayer,
    setPokemonEnemyCurrentHp,
    setPokemonEnemyCaptureRate,
    setPokemonPlayerCurrentHp,
    setBattleStatus,
    changePokemonEnemyStat,
    changePokemonAllyStat,
    passRound,
    resetBattleState
} = battle.actions;
export default battle.reducer;
