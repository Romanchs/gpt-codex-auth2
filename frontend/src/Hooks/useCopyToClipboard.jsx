import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { enqueueSnackbar } from '../actions/notistackActions';
import {useTranslation} from "react-i18next";

export const useCopyToClipboard = () => {
  const [copiedText, setCopiedText] = useState(null);

  const copy = async (text) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopiedText(null);
      return false;
    }
  };

  return { copiedText, copy };
};

export const useCopyToClipboardWithSnackbar = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const { copiedText, copy: originalCopy } = useCopyToClipboard();

  return {
    copiedText,
    copy: (value) => {
      originalCopy(value);
      dispatch(
        enqueueSnackbar({
          message: t('FIELDS.TEXT_BEEN_COPIED'),
          options: {
            key: new Date().getTime() + Math.random(),
            variant: 'success',
            autoHideDuration: 3000
          }
        })
      );
    }
  };
};
