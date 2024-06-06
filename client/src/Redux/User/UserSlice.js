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
     }
    }
  })


  export const { signInFailure , signInSuccess } = UserSlice.actions

  export default UserSlice.reducer