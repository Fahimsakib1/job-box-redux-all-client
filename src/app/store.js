import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import AuthSlice from '../features/Auth/AuthSlice';
import apiSlice from '../features/API/apiSlice';


const store = configureStore({
    reducer: {
        auth: AuthSlice,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
})

export default store;