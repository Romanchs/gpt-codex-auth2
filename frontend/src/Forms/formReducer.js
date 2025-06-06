/* eslint-disable no-unused-vars */
import {CLEAR_FORM, FORM_UPDATED} from './types';

export default function forms(state = { activeField: '' }, action) {
  switch (action.type) {
    case FORM_UPDATED: {
      const { formName, fieldName, data } = action.payload;
      if (!data) {
        const { [fieldName]: value, ...newState } = state[formName];
        return { ...state, [formName]: newState, activeField: fieldName };
      }
      return { ...state, [formName]: { ...state[formName], [fieldName]: data }, activeField: fieldName };
    }
    case CLEAR_FORM: {
      const { [action.payload.formName]: value, ...newState } = state;
      return { ...newState, activeField: '' };
    }
    default:
      return state;
  }
}
