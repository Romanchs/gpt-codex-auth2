import { mainApi } from '../../app/mainApi';
import { saveAsFile } from '../../util/files';

const baseUrl = '/ms-users/api/v1';

const rolesApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    rolesList: build.query({
      query: (params) => ({
        url: `${baseUrl}/new-roles-simplified/`,
        params
      }),
      providesTags: ['GET_ROLES_LIST']
    }),
    getRole: build.query({
      query: (uid) => ({
        url: `${baseUrl}/new-roles-simplified/${uid}/`
      }),
      transformResponse: (res) => ({ ...res, permissions: JSON.parse(res.permissions) })
    }),
    exportRole: build.query({
      query: ({ uid, role }) => ({
        url: `${baseUrl}/new-roles-simplified/${uid}/export/`,
        cache: 'no-cache',
        responseHandler: (response) => {
          response.blob().then((file) => {
            saveAsFile(
              file,
              'Властивості ролі ' + (role?.name_ua || role?.code) + '.xlsx',
              response.headers.get('content-type') || ''
            );
          });
        }
      })
    }),
    createRole: build.mutation({
      query: (body) => ({
        url: `${baseUrl}/new-roles-simplified/`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['GET_ROLES_LIST']
    }),
    updateRole: build.mutation({
      query: ({ uid, ...rest }) => ({
        url: `${baseUrl}/new-roles-simplified/${uid}/`,
        method: 'PUT',
        body: rest
      }),
      invalidatesTags: ['GET_ROLES_LIST']
    })
  }),
  overrideExisting: false
});

export const {
  useRolesListQuery,
  useLazyGetRoleQuery,
  useLazyExportRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation
} = rolesApi;
