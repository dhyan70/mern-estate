import { createSlice } from '@reduxjs/toolkit'

const initialState ={
    currentUser :null,
    error :null
}

export const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      signInSuccess:(state,action)=>{
         state.error=null,
         state.currentUser = action.payload
      },
      signInFailure:(state,action)=>{
        state.error=action.payload
     },
     updateSuccess:(state,action)=>{
      state.currentUser = action.payload
     },
     updateFailure:(state,action)=>{
      state.error=action.payload
   },
   deleteSuccess:(state,action)=>{
      state.currentUser = null
     },
     deleteFailure:(state,action)=>{
      state.error=action.payload
   },
   ErrorUpdate:(state)=>{
      state.error=null
   }
    }
  })


  export const { signInFailure , signInSuccess , updateFailure , updateSuccess , deleteFailure , deleteSuccess , ErrorUpdate } = UserSlice.actions

  export default UserSlice.reducer