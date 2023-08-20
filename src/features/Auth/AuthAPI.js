import apiSlice from "../API/apiSlice";

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
            })
        })
    })
})

export const {useRegisterMutation} = AuthAPI