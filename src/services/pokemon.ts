import config from '@/config/config';
import {
    IResponseGetEvolutionChain,
    IResponseGetMove,
    IResponseGetPokemonById,
    IResponseGetSpecieById,
    IResponseGetType
} from '@/types/pokeApiResponses';
import { cache } from '@/utils/functions/cache';
import axios from 'axios';

export const PokemonService = {
    getDetail: async (value: number | string) => {
        try {
            const cacheKey = `cache_pokemon_service_get_detail_value_${value}`;
            const cacheData = await cache.get(cacheKey);

            if (cacheData) {
                return cacheData as IResponseGetPokemonById;
            }

            const url = `${config.urls.pokeApi}/pokemon/${value}`;
            const response = await axios.get(url);
            const data = response.data as IResponseGetPokemonById;

            cache.set(cacheKey, data);

            return data;
        } catch (e) {
            return null;
        }
    },
    getSpecieById: async (id: number) => {
        try {
            const cacheKey = `cache_pokemon_service_get_specie_${id}`;
            const cacheData = await cache.get(cacheKey);

            if (cacheData) {
                return cacheData as IResponseGetSpecieById;
            }

            const url = `${config.urls.pokeApi}/pokemon-species/${id}`;
            const response = await axios.get(url);
            const data = response.data as IResponseGetSpecieById;

            cache.set(cacheKey, data);

            return data;
        } catch (e) {
            return null;
        }
    },
    getMoveDetailByUrl: async (url: string) => {
        try {
            const cacheKey = `cache_pokemon_service_get_move_detail_${url}`;
            const cacheData = await cache.get(cacheKey);

            if (cacheData) {
                return cacheData as IResponseGetMove;
            }

            const response = await axios.get(url);
            const data = response.data as IResponseGetMove;

            cache.set(cacheKey, data);

            return data;
        } catch (e) {
            return null;
        }
    },
    getTypeDetailByUrl: async (url: string) => {
        try {
            const cacheKey = `cache_pokemon_service_get_type_detail_${url}`;
            const cacheData = await cache.get(cacheKey);

            if (cacheData) {
                return cacheData as IResponseGetType;
            }

            const response = await axios.get(url);
            const data = response.data as IResponseGetType;

            cache.set(cacheKey, data);

            return data;
        } catch (e) {
            return null;
        }
    },
    getEvolutionDetailByUrl: async (url: string) => {
        try {
            const cacheKey = `cache_pokemon_service_get_evolution_detail_${url}`;
            const cacheData = await cache.get(cacheKey);

            if (cacheData) {
                return cacheData as IResponseGetEvolutionChain;
            }

            const response = await axios.get(url);
            const data = response.data as IResponseGetEvolutionChain;

            cache.set(cacheKey, data);

            return data;
        } catch (e) {
            return null;
        }
    }
};
