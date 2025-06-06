import { CLEAR_FORM, FORM_UPDATED } from './types';

export const updateForm = (formName, fieldName, data) => ({
  type: FORM_UPDATED,
  payload: {
    formName,
    fieldName,
    data
  }
});

export const clearForm = (formName) => ({
  type: CLEAR_FORM,
  payload: {
    formName
  }
});
