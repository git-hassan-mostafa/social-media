import { configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice'
import stateSlice from './stateSlice'
export default configureStore({
    reducer:{
        user:userSlice,
        state:stateSlice
    }
})