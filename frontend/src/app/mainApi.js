import { getEnv } from '../util/getEnv';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { saveAsFile } from '../util/files';
import { refreshToken } from '../services/refreshToken';

export const baseQuery = fetchBaseQuery({
  baseUrl: getEnv().baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const state = getState();
    if (state.user.authorized) {
      headers.append('authorization', `Bearer ${localStorage.getItem('auth_token')}`);
    }
    return headers;
  }
});

export const checkRefreshQuery = async (args, api, extraOptions) => {
  await refreshToken();
  return baseQuery(args, api, extraOptions);
};

export const mainApi = createApi({
  reducerPath: 'mainApi',
  baseQuery: checkRefreshQuery,
  endpoints: (build) => ({
    esignChallenge: build.mutation({
      query: ({ state }) => ({
        url: `/ms-users/api/v1/token/esign/challenge/?state=${encodeURIComponent(state)}`,
        method: 'POST'
      })
    }),
    esignLogin: build.mutation({
      query: ({ state, ...body }) => ({
        url: `/ms-users/api/v1/token/esign/confirm/?state=${encodeURIComponent(state)}`,
        method: 'POST',
        body
      })
    }),
    publicCompaniesList: build.query({
      query: (params) => ({
        url: `/ms-companies/api/v1/public-search`,
        params
      })
    }),
    mgaEics: build.query({
      query: (params) => ({
        url: 'ms-gts/api/v1/gts/metering-grid-areas',
        params
      })
    }),
    usersList: build.query({
      query: (params) => ({
        url: `/ms-users/api/v1/users/`,
        params
      })
    }),
    referenceBookKV: build.query({
      query: (params) => ({
        url: `/ms-reference-book/api/v1/reference-book-kv/201-1/name_ua/code`,
        params
      }),
      transformResponse: (res) => Object.keys(res).map((i) => ({ label: i, eic: res[i] }))
    }),
    referenceBookKey: build.query({
      query: () => `/ms-reference-book/api/v1/reference-book-kv/108-1-1/name_ua/key`
    }),
    referenceBookCompact: build.query({
      query: ({ code, field }) => `/ms-reference-book/api/v1/reference-book-compact/${code}/${field}`
    }),
    auditMeteringPoints: build.query({
      query: (params) => ({
        url: `/ms-ppko-submission/api/v1/audit/metering-points`,
        params
      })
    }),

    // MS FILES
    msFilesDownload: build.query({
      query: ({ id, name }) => ({
        url: `/ms-files/api/v1/files/${id}`,
        cache: 'no-cache',
        responseHandler: (response) => {
          if (response.status !== 200) {
            return response.json();
          }
          let fileName = name;
          const disposition = response.headers.get('content-disposition');
          if (disposition) {
            fileName = decodeURIComponent(disposition.replaceAll("attachment; filename*=utf-8''", ''));
          }
          response.blob().then((file) => {
            saveAsFile(file, fileName, response.headers.get('content-type') || '');
          });
        }
      })
    }),

    updateLanguage: build.mutation({
      query: (language) => ({
        url: `/ms-users/api/v1/language/`,
        method: 'PATCH',
        body: {
          language
        }
      })
    })
  })
});

export const {
  useEsignChallengeMutation,
  useEsignLoginMutation,
  useReferenceBookKeyQuery,
  useLazyMsFilesDownloadQuery,
  useReferenceBookCompactQuery,
  useUpdateLanguageMutation
} = mainApi;
