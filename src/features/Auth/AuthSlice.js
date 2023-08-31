import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
}
    from 'firebase/auth';
import auth from "../../firebase/firebase.config";




const initialState = {
    user: {
        email: "",
        role: ""
    },
    isLoading: true,
    // loginSuccess: false,
    // logOutSuccess: false,
    isError: false,
    error: "",
}




export const createUser = createAsyncThunk("auth/createUser", async (data) => {
    const userData = await createUserWithEmailAndPassword(auth, data.email, data.password);
    return userData.user.email;
})

export const userLogin = createAsyncThunk("auth/userLogin", async (data) => {
    const logInData = await signInWithEmailAndPassword(auth, data.email, data.password);
    console.log('Login Data', logInData);
    return logInData.user.email;
})

export const userLogOut = createAsyncThunk("auth/userLogOut", async () => {
    const logOutData = await signOut(auth);
    return logOutData;
})

export const googleLogin = createAsyncThunk("auth/googleLogin", async () => {
    const providerGoogle = new GoogleAuthProvider();
    const googleSignInData = await signInWithPopup(auth, providerGoogle);
    return googleSignInData.user.email;
})

//get the user by user email
export const getUser = createAsyncThunk("auth/getUser", async (email) => {
    const response = await fetch(`https://job-box-server-mu.vercel.app/user/${email}`)
    const data = await response.json()
    
    if(data.status){
        return data;
    }
    return email
})



const AuthSlice = createSlice({
    name: 'auth',
    initialState,

    reducers: {

        setUser: (state, action) => {
            state.user.email = action.payload
            state.isLoading = false;
        },

        // toggleUserCreateSuccess: (state) => {
        //     state.userSuccess = false;
        // },

        // toggleLoginSuccess: (state) => {
        //     state.loginSuccess = false;
        //     state.isError = '';
        // },

        // toggleLogOutSuccess: (state) => {
        //     state.logOutSuccess = false;
        //     state.user.email = ''
        // },

        toggleLogOut: (state) => {
            state.user = {email: "", role: ""}
        },

        toggleIsLoading: (state) => {
            state.isLoading = false
        }
    },



    extraReducers: (builder) => {
        builder
            .addCase(createUser.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.error = ''
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user.email = action.payload;
                state.isError = false;
                state.error = ''
            })
            .addCase(createUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user.email = "";
                state.isError = true;
                state.error = action.error.message;
            })



            .addCase(userLogin.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.error = ''
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user.email = action.payload;
                state.isError = false;
                state.error = ''
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.user.email = ""
                state.isError = true;
                state.error = action.error.message;
            })


            .addCase(userLogOut.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.error = ''
            })
            .addCase(userLogOut.fulfilled, (state, action) => {
                // state.isLoading = false;
                // state.user.email = action.payload;
                // state.isError = false;
                // state.error = ''

                state.isLoading = false;
                state.user = {email:"", role: ""}
                state.isError = false;
                state.error = ''
            })
            .addCase(userLogOut.rejected, (state, action) => {
                state.isLoading = false;
                state.user.email = ""
                state.isError = true;
                state.error = action.error.message;
            })


            .addCase(googleLogin.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.error = ''
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user.email = action.payload;
                state.isError = false;
                state.error = ''
            })
            .addCase(googleLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.user.email = ""
                state.isError = true;
                state.error = action.error.message;
            })


            .addCase(getUser.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.error = ''
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.isLoading = false;
                
                if(action.payload.status){
                    state.user = action.payload.data;
                }
                else{
                    state.user.email = action.payload;
                }
                state.isError = false;
                state.error = ''
            })
            .addCase(getUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user.email = ""
                state.isError = true;
                state.error = action.error.message;
            })
    }

})


export const { toggleUserCreateSuccess, toggleLoginSuccess, toggleLogOutSuccess, setUser, toggleLogOut, toggleIsLoading } = AuthSlice.actions
export default AuthSlice.reducer

