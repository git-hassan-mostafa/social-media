import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const stateSlice = createSlice({
  name: 'state',
  initialState: {
    logoutConfirmOpen:false,
    toggleSideBar:false
  },
  reducers: {
    togglingSideBar(state){
      state.toggleSideBar=!state.toggleSideBar
    }
  },
})
export const { togglingSideBar } = stateSlice.actions

export default stateSlice.reducer