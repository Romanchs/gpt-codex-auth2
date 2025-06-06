import { mainApi } from '../../../app/mainApi';

const BASE_API_CANCEL_PPKO = '/ms-processes-v2/api/v1/cancel-ppko-registration/';
const BASE_API_REQUEST_CANCEL_PPKO = '/ms-processes-v2/api/v1/request-cancel-ppko-registration/';
const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    autocompleteCancelPPKORegistration: build.query({
      query: () => ({
        url: BASE_API_CANCEL_PPKO + 'autocomplete'
      }),
      providesTags: ['CANCEL_PPKO_REGISTRATION_AUTOCOMPLETE']
    }),
    companiesCancelPPKORegistration: build.query({
      query: (params) => ({
        url: '/ms-ppko/api/v1/ppko_register_full/',
        params
      })
    }),
    cancelPPKORegistration: build.query({
      query: (uid) => ({
        url: (window.location.pathname.includes('request') ? BASE_API_REQUEST_CANCEL_PPKO : BASE_API_CANCEL_PPKO) + uid
      }),
      providesTags: ['CANCEL_PPKO_REGISTRATION']
    }),
    initCancelPPKORegistration: build.mutation({
      query: (body) => ({
        url: BASE_API_CANCEL_PPKO,
        method: 'POST',
        body
      })
    }),
    updateCancelPPKORegistration: build.mutation({
      query: ({ uid, type }) => ({
        url: BASE_API_CANCEL_PPKO + uid + type,
        method: 'POST'
      }),
      invalidatesTags: ['CANCEL_PPKO_REGISTRATION_AUTOCOMPLETE', 'CANCEL_PPKO_REGISTRATION']
    }),
    updateRequestCancelPPKORegistration: build.mutation({
      query: ({ uid, type, body }) => ({
        url: BASE_API_REQUEST_CANCEL_PPKO + uid + type,
        method: 'POST',
        body
      }),
      invalidatesTags: ['CANCEL_PPKO_REGISTRATION']
    }),
    expireCancelPPKORegistration: build.query({
      query: (uid) => ({
        url: '/ms-processes-v2/api/v1/cancel-ppko-registration-on-expire/' + uid
      })
    })
  }),
  overrideExisting: true
});

export const {
  useAutocompleteCancelPPKORegistrationQuery,
  useCompaniesCancelPPKORegistrationQuery,
  useCancelPPKORegistrationQuery,
  useInitCancelPPKORegistrationMutation,
  useUpdateCancelPPKORegistrationMutation,
  useUpdateRequestCancelPPKORegistrationMutation,
  useExpireCancelPPKORegistrationQuery
} = api;
