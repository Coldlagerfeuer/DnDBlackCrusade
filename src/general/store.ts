import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { characteristicsSlice } from "../components/characteristics/characteristicsSlice";
import { skillSlice } from "../components/skills/skillSlice";
import { talentSlice } from "../components/talents/talentSlice";
import { inventorySlice } from "../components/inventory/inventorySlice";
import { characterSlice } from "../components/character/characterSlice";
import { armourySlice } from "../components/armoury/armourySlice";

/**
 * Creates the Redux store and adds the default middlewares from redux toolkit as well as the router middleware
 */
const store = configureStore({
    reducer: {
        character: characterSlice.reducer,
        characteristics: characteristicsSlice.reducer,
        skills: skillSlice.reducer,
        talents: talentSlice.reducer,
        inventory: inventorySlice.reducer,
        armoury: armourySlice.reducer
    },
    middleware: [...getDefaultMiddleware()],
});

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export default store
