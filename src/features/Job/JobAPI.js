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

        jobStatusToggle: build.mutation({
            query: (data) => ({
                url: '/toggleJobStatus',
                method: 'PATCH',
                body: data,
                headers: {
                    'Content-type': 'application/json',
                },
            }),
            invalidatesTags: ['job']
        }),

        //API endpoints for filtering the applied jobs based on applied dates
        userAppliedFilterJobs: build.query({
            query: (email) => ({
                url: `/filter/appliedJobs/${email}`
            }),
        }),

        //API endpoints for filtering the applied jobs based on applied dates reverse
        userAppliedNoFilterJobs: build.query({
            query: (email) => ({
                url: `/noFilter/appliedJobs/${email}`
            }),
        }),



    })
})


export const { useAddJobMutation, useGetAllJobsQuery, useGetJobByIDQuery, useApplyJobMutation, useAskQuestionMutation, useReplyMutation, useJobStatusToggleMutation, useUserAppliedFilterJobsQuery, useUserAppliedNoFilterJobsQuery, useUserAppliedJobsQuery } = JobAPI