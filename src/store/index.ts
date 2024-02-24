import { combineReducers, configureStore } from '@reduxjs/toolkit';
import globalReducer from './reducers/global';
import playerReducer from './reducers/player';
import battleReducer from './reducers/battle';

const reducer = combineReducers({
    global: globalReducer,
    player: playerReducer,
    battle: battleReducer
});

const store = configureStore({
    reducer
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
