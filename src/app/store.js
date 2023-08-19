import { configureStore } from '@reduxjs/toolkit'
import AuthSlice from '../features/Auth/AuthSlice';


const store = configureStore({
    reducer: {
        auth: AuthSlice
    },
})

export default store;