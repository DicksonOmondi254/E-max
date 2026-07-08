import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {

    id:number;

    firstName:string;

    lastName:string;

    email:string;

    phone:string;

    role:"customer"|"admin";

    token:string;

}

interface AuthState{

    user:User|null;

    isAuthenticated:boolean;

    loading:boolean;

}

const initialState:AuthState={

    user:null,

    isAuthenticated:false,

    loading:false,

};

const authSlice=createSlice({

    name:"auth",

    initialState,

    reducers:{

        loginStart:(state)=>{

            state.loading=true;

        },

        loginSuccess:(state,action:PayloadAction<User>)=>{

            state.loading=false;

            state.user=action.payload;

            state.isAuthenticated=true;

        },

        logout:(state)=>{

            state.user=null;

            state.isAuthenticated=false;

        }

    }

});

export const{

loginStart,

loginSuccess,

logout

}=authSlice.actions;

export default authSlice.reducer;