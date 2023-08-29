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


        tryFilter: build.query({
            query: (data) => ({
                url: `/filter/${data?.filterValue}/${data?.email}`
            }),

        }),

        // add message by an employer to a candidate
        sentMessageByEmployer: build.mutation({
            query: (data) => ({
                url: '/messageByEmployer',
                method: 'PATCH',
                body: data,
                headers: {
                    'Content-type': 'application/json',
                },
            })
        }),

        //get and display the messages for the employer for a particular candidate
        getMessageForEmployer: build.query({
            query: (data) => ({
                url: `/employer/messages/${data?.appliedJob}/${data?.email}`
            }),

        }),


        // reply message by a candidate to an employer for a particular job position
        sentReplyByCandidate: build.mutation({
            query: (data) => ({
                url: '/replyByCandidate',
                method: 'PATCH',
                body: data,
                headers: {
                    'Content-type': 'application/json',
                },
            })
        }),

        //get and display the reply messages by the candidate to the employer for a particular job position
        getReplyMessageForCandidate: build.query({
            query: (data) => ({
                url: `/candidate/replies/${data?.jobId}/${data?.candidateEmail}`
            }),

        }),



    })
})


export const { useAddJobMutation, useGetAllJobsQuery, useGetJobByIDQuery, useApplyJobMutation, useAskQuestionMutation, useReplyMutation, useJobStatusToggleMutation, useUserAppliedJobsQuery, useTryFilterQuery, useSentMessageByEmployerMutation, useGetMessageForEmployerQuery, useSentReplyByCandidateMutation, useGetReplyMessageForCandidateQuery } = JobAPI