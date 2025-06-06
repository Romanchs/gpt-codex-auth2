import { enqueueSnackbar } from "../../../actions/notistackActions";
import { mainApi } from "../../../app/mainApi";

const BASE_API = '/ms-processes-v2/api/v1/prolongation-contract';

const prolongationSupplyApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    initProlongationSupply: build.mutation({
      query: () => ({
        url: `${BASE_API}`,
        method: 'POST'
      }),
      transformResponse: (response) => response.uid,
    }),
    prolongationSupply: build.query({
      query: (uid) => `${BASE_API}/${uid}`,
      providesTags: ['PROLOGATION_SUPPLY']
    }),
    updateProlongationSupply: build.mutation({
      query: ({uid, type, body}) => ({
        url: `${BASE_API}/${uid}/${type}`,
        method: 'POST',
        body
      }),
      async onQueryStarted({uid}, {dispatch, queryFulfilled}) {
        queryFulfilled.then(res => {
          if(res.data?.alert) {
            dispatch(enqueueSnackbar({
              message: res.data.alert,
              options: {
                key: new Date().getTime() + Math.random(),
                variant: 'success',
                autoHideDuration: 5000
              }
            }));
          }
          dispatch(mainApi.util.updateQueryData('prolongationSupply', uid, () => {
            return res.data;
          }));
        })
      },
    }),
    prolongationSupplyUpload: build.mutation({
      query: ({uid, body}) => ({
        url: `/ms-upload/api/v1/upload/prolongation-tko/${uid}/xlsx`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['PROLOGATION_SUPPLY']
    })
  }),
  overrideExisting: false
})

export const {
  useInitProlongationSupplyMutation,
  useProlongationSupplyQuery,
  useUpdateProlongationSupplyMutation,
  useProlongationSupplyUploadMutation
} = prolongationSupplyApi;
