import { IPlayer } from '@/types/player';
import { IPokemon, IPokemonMove } from '@/types/pokemon';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const player = createSlice({
    name: 'player',
    initialState: null as IPlayer | null,
    reducers: {
        setPlayer(_, action: PayloadAction<IPlayer>) {
            return action.payload;
        },
        setPlayerMoney(state, action: PayloadAction<number>) {
            if (state) {
                state.inventory.money = action.payload;
            }
        },
        addPlayerPokeballs(state, action: PayloadAction<number>) {
            if (state) {
                state.inventory.pokeballs.simple = state.inventory.pokeballs.simple + action.payload;
            }
        },
        addPlayerPotions(state, action: PayloadAction<number>) {
            if (state) {
                state.inventory.potions.simple = state.inventory.potions.simple + action.payload;
            }
        },
        setPlayerFightStatistics(state, action: PayloadAction<IPlayer['statistics']['fight']>) {
            if (state?.statistics.fight) {
                state.statistics.fight = action.payload;
            }
        },
        decreasePlayerPokeball(state) {
            if (state?.inventory.pokeballs.simple) {
                state.inventory.pokeballs.simple = state.inventory.pokeballs.simple - 1;
            }
        },
        addPlayerMovePokemon(state, action: PayloadAction<{ pokemonId: IPokemon['id']; newMove: IPokemonMove }>) {
            if (state) {
                state.pokemons = state.pokemons.map((pokemon) => {
                    if (pokemon.id === action.payload.pokemonId) {
                        pokemon.moves.push(action.payload.newMove);
                    }
                    return pokemon;
                });
            }
        },
        updatePlayerMovePokemon(state, action: PayloadAction<{ pokemonId: IPokemon['id']; oldMove: IPokemonMove; newMove: IPokemonMove }>) {
            if (state) {
                state.pokemons = state.pokemons.map((pokemon) => {
                    if (pokemon.id === action.payload.pokemonId) {
                        pokemon.moves = pokemon.moves.map((move) => {
                            if (move.id === action.payload.oldMove.id) {
                                return action.payload.newMove;
                            }

                            return move;
                        });
                    }
                    return pokemon;
                });
            }
        },
        updatePlayerPokemon(state, action: PayloadAction<IPokemon>) {
            if (state) {
                state.pokemons = state.pokemons.map((pokemon) => {
                    if (pokemon.id === action.payload.id) {
                        return action.payload;
                    }
                    return pokemon;
                });
            }
        },
        replacePlayerPokemon(state, action: PayloadAction<{ pokemonEvolved: IPokemon; pokemonOldId: number }>) {
            if (state) {
                state.pokemons = state.pokemons.map((pokemon) => {
                    if (pokemon.id === action.payload.pokemonOldId) {
                        return action.payload.pokemonEvolved;
                    }
                    return pokemon;
                });
            }
        },
        addExpPlayerPokemon(state, action: PayloadAction<{ expGained: number; pokemonId: number }>) {
            if (state) {
                state.pokemons = state.pokemons.map((pokemon) => {
                    if (pokemon.id === action.payload.pokemonId) {
                        const expUpdated = pokemon.stats.xp.current + action.payload.expGained;
                        pokemon.stats.xp.current = expUpdated;

                        while (expUpdated >= pokemon.stats.xp.total) {
                            pokemon.stats.xp.total = pokemon.stats.xp.base * (pokemon.level + 2);
                            pokemon.level = pokemon.level + 1;
                        }
                    }

                    return pokemon;
                });
            }
        },
        addPlayerPokemon(state, action: PayloadAction<IPokemon>) {
            if (state) {
                const newPokemon = JSON.parse(JSON.stringify(action.payload));
                newPokemon.stats.hp.current = newPokemon.stats.hp.total;
                state.pokemons = [...state.pokemons, newPokemon];
            }
        }
    }
});

export const {
    setPlayer,
    setPlayerMoney,
    updatePlayerPokemon,
    updatePlayerMovePokemon,
    addPlayerMovePokemon,
    addExpPlayerPokemon,
    replacePlayerPokemon,
    setPlayerFightStatistics,
    decreasePlayerPokeball,
    addPlayerPokeballs,
    addPlayerPotions,
    addPlayerPokemon
} = player.actions;
export default player.reducer;
