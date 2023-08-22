import apiSlice from "../API/apiSlice";



const JobAPI = apiSlice.injectEndpoints({
    endpoints: (builder) =>({
        
        addJob: builder.mutation({
            query: (data) => ({
                url: '/job',
                method: 'POST',
                body: data,
                headers: {
                    'Content-type': 'application/json',
                },
            }),
        }),

        getAllJobs: builder.query({
            query: () => ({
                url: '/jobs'
            }),
        }),

        getJobByID: builder.query({
            query: (id) => ({
                url: `/job/${id}`
            }),
        }),
    })
})


export const {useAddJobMutation, useGetAllJobsQuery, useGetJobByIDQuery} = JobAPI