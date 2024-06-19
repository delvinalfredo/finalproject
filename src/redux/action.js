export const addToPokedex = (item) => ({
    type: 'ADD_TO_POKEDEX',
    payload: item,
});

export const removeFromPokedex = (item) => ({
    type: 'REMOVE_FROM_POKEDEX',
    payload: item,
});

export const setPokedex = (pokedex) => ({
    type: 'SET_POKEDEX',
    payload: pokedex,
});

