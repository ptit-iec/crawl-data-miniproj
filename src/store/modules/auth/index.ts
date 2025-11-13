import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface LoginData {
    access_token : string;
}
export interface authState {
    login : LoginData | undefined;
    isLogin : boolean;
}

const initialState : authState = {
    login : undefined,
    isLogin : false
}

export const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers : {
        startRequestLogin : (state) => {
            state.isLogin = true;
        },
        requestLoginSuccess : (state , action : PayloadAction<LoginData>) => {
            state.isLogin = false;
            state.login = action.payload
        },
        requestLoginFail : (state) => {
            state.isLogin = false;
        },
    },
});

export const {
    startRequestLogin,requestLoginSuccess,requestLoginFail,
} = authSlice.actions;

export default authSlice.reducer;

