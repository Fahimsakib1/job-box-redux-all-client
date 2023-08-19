import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import auth from "../../firebase/firebase.config";




const initialState = {
    email: "",
    role: "",
    isLoading: true,
    userSuccess: false,
    loginSuccess: false,
    logOutSuccess: false,
    isError: false,
    error: ""
}




export const createUser = createAsyncThunk("auth/createUser", async (data) => {
    const userData = await createUserWithEmailAndPassword(auth, data.email, data.password);
    return userData;
})


export const userLogin = createAsyncThunk("auth/userLogin", async (data) => {
    const logInData = await signInWithEmailAndPassword(auth, data.email, data.password);
    return logInData;
})

export const userLogOut = createAsyncThunk("auth/userLogOut", async () => {
    const logOutData = await signOut(auth);
    return logOutData;
})

export const googleLogin = createAsyncThunk("auth/googleLogin", async () => {
    const providerGoogle = new GoogleAuthProvider();
    const googleSignInData = await signInWithPopup(auth, providerGoogle);
    return googleSignInData;
})




const AuthSlice = createSlice({
    name: 'auth',
    initialState,

    reducers: {

        setUser: (state, action) => {
            state.email = action.payload
            state.isLoading = false;
        },

        toggleUserCreateSuccess: (state) => {
            state.userSuccess = false;
        },

        toggleLoginSuccess: (state) => {
            state.loginSuccess = false;
        },

        toggleLogOutSuccess: (state) => {
            state.logOutSuccess = false;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(createUser.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.userSuccess = false;
                state.error = ''
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.email = action.payload.user.email;
                state.userSuccess = true;
                state.isError = false;
                state.error = ''
            })
            .addCase(createUser.rejected, (state, action) => {
                state.isLoading = false;
                state.email = ""
                state.isError = true;
                state.error = action.error.message;
                state.userSuccess = false;
            })
            .addCase(userLogin.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.loginSuccess = false;
                state.error = ''
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.loginSuccess = true;
                state.email = action.payload.user.email;
                state.isError = false;
                state.error = ''
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.email = ""
                state.isError = true;
                state.error = action.error.message;
                state.loginSuccess = false;
            })
            .addCase(userLogOut.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.logOutSuccess = false;
                state.error = ''
            })
            .addCase(userLogOut.fulfilled, (state) => {
                state.isLoading = false;
                state.logOutSuccess = true;
                state.email = '';
                state.isError = false;
                state.error = '';
                state.loginSuccess = false;
            })
            .addCase(userLogOut.rejected, (state, action) => {
                state.isLoading = false;
                state.email = ""
                state.isError = true;
                state.error = action.error.message;
                state.logOutSuccess = false;
            })



            .addCase(googleLogin.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.loginSuccess = false;
                state.error = ''
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.loginSuccess = true;
                state.email = action.payload.user.email;
                state.isError = false;
                state.error = ''
            })
            .addCase(googleLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.email = ""
                state.isError = true;
                state.error = action.error.message;
                state.loginSuccess = false;
            })
    }

})


export const { toggleUserCreateSuccess, toggleLoginSuccess, toggleLogOutSuccess, setUser } = AuthSlice.actions
export default AuthSlice.reducer