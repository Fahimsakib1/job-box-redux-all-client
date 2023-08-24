import apiSlice from "../API/apiSlice";



const JobAPI = apiSlice.injectEndpoints({
    endpoints: (build) => ({

        addJob: build.mutation({
            query: (data) => ({
                url: '/job',
                method: 'POST',
                body: data,
                headers: {
                    'Content-type': 'application/json',
                },
            }),
            invalidatesTags: ['jobs']
        }),

        getAllJobs: build.query({
            query: () => ({
                url: '/jobs'
            }),
            providesTags: ['jobs']
        }),

        getJobByID: build.query({
            query: (id) => ({
                url: `/job/${id}`
            }),
            providesTags: ['job']
        }),

        applyJob: build.mutation({
            query: (data) => ({
                url: '/apply',
                method: 'PATCH',
                body: data,
                headers: {
                    'Content-type': 'application/json',
                },
            })
        }),

        userAppliedJobs: build.query({
            query: (email) => ({
                url: `/applied-jobs/${email}`
            }),
        }),

        askQuestion: build.mutation({
            query: (data) => ({
                url: '/query',
                method: 'PATCH',
                body: data,
                headers: {
                    'Content-type': 'application/json',
                },
            }),
            invalidatesTags: ['job']
        }),

        reply: build.mutation({
            query: (data) => ({
                url: '/reply',
                method: 'PATCH',
                body: data,
                headers: {
                    'Content-type': 'application/json',
                },
            }),
            invalidatesTags: ['job']
        }),

    })
})


export const { useAddJobMutation, useGetAllJobsQuery, useGetJobByIDQuery, useApplyJobMutation, useUserAppliedJobsQuery, useAskQuestionMutation, useReplyMutation } = JobAPI