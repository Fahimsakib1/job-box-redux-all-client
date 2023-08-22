import apiSlice from "../API/apiSlice";
import { getUser } from "./AuthSlice";



const AuthAPI = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: '/user',
                method: 'POST',
                body: data,
                headers: {
                    'Content-type': 'application/json',
                },
            }),
            async onQueryStarted(data, {dispatch, queryFulfilled}) {
                try{
                    const res = await queryFulfilled
                    dispatch(getUser(data.email))
                }
                catch (error){
                    console.log(error);
                }
            }
        }),
    })
})

export const {useRegisterMutation} = AuthAPI