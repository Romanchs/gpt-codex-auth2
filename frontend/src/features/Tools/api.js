import { mainApi } from '../../app/mainApi';
import { saveAsFile } from '../../util/files';

const toolsApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    signTestFile: build.mutation({
      query: (body) => ({
        url: `/ms-decrypt/api/v1/sign-test-file`,
        method: 'POST',
        body,
        responseHandler: async (response) => {
          if (response.headers.get('content-type') === 'application/json') return response.json();
          response.blob().then((file) => {
            saveAsFile(file, response.headers.get('content-disposition') || 'SignFile.zip', response.headers.get('content-type') || 'application/zip');
          });
          return 'ok';
        }
      })
    })
  }),
  overrideExisting: false
});

export const { useSignTestFileMutation } = toolsApi;
