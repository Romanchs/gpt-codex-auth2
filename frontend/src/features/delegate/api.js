import { mainApi } from '../../app/mainApi';

const delegateApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    delegate: build.mutation({
      query: (process_uid) => ({
        url: `/ms-processes-v2/api/v1/subprocess/delegate/${process_uid}`,
        method: 'POST'
      })
    })
  }),
  overrideExisting: false
});

export const { useDelegateMutation, useDelegateListQuery } = delegateApi;
