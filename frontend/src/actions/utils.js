/**
 * Redux Async action creator
 * @param {string} name
 * @param {function} apiCall
 * @returns
 * @example
 * export const { action: getDisputeEntity } = makeAction(
 * 'GET_DISPUTE_ENTITY',
 *  (uid) => api.disputes.getDisputeEntity(uid).then((r) => r.data)
 * );
 */
export const makeAction = (name, apiCall = () => Promise.resolve()) => {
  const pendingType = `${name}_STARTED`;
  const successType = `${name}_SUCCESS`;
  const failedType = `${name}_FAILURE`;

  const pendingAction = () => ({
    type: pendingType,
    payload: {}
  });

  const successAction = (data) => ({
    type: successType,
    payload: { data }
  });

  const failAction = (error) => ({
    type: failedType,
    payload: { error }
  });

  const action = (params) => async (dispatch) => {
    try {
      dispatch(pendingAction());
      const data = await apiCall(params);
      dispatch(successAction(data));
      return data;
    } catch (err) {
      dispatch(failAction(err));
    }
  };

  return { action, pendingType, successType, failedType, pendingAction, successAction, failAction };
};
