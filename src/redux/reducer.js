const initialState = {
    wishlist: [],
};

const pokedexReducer = (state = initialState.pokedex, action) => {
    switch (action.type) {
        case 'ADD_TO_POKEDEX':
            return [...state, action.payload];
        case 'REMOVE_FROM_POKEDEX':
            return state.filter((item) => item.id !== action.payload.id);
        case 'SET_POKEDEX':
            return action.payload;
        default:
            return state;
    }
};

const rootReducer = (state = initialState, action) => {
    return {
        pokedex: pokedexReducer(state.pokedex, action)
    };
};

export default rootReducer;
