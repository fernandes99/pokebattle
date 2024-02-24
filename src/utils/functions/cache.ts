/* eslint-disable @typescript-eslint/no-explicit-any */
// Função para abrir o banco de dados IndexedDB
const openDatabase = async (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('pokemonCacheDatabase', 1);

        request.onupgradeneeded = (event) => {
            const db = (event.target as any).result;
            db.createObjectStore('pokemonCache', { keyPath: 'key' });
        };

        request.onsuccess = (event) => {
            resolve((event.target as any).result);
        };

        request.onerror = (event) => {
            reject((event.target as any).error);
        };
    });
};

export const cache = {
    get: async (key: string): Promise<any | null> => {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['pokemonCache'], 'readonly');
            const objectStore = transaction.objectStore('pokemonCache');
            const request = objectStore.get(key);

            request.onsuccess = () => {
                resolve(request.result ? JSON.parse(request.result.value) : null);
            };

            request.onerror = (event) => {
                reject((event.target as any).error);
            };
        });
    },
    set: async (key: string, value: any): Promise<void> => {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['pokemonCache'], 'readwrite');
            const objectStore = transaction.objectStore('pokemonCache');
            const request = objectStore.put({ key, value: JSON.stringify(value) });

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (event) => {
                reject((event.target as any).error);
            };
        });
    }
};
