import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import { useArchiningTkoQuery } from './api';
import { useParams } from 'react-router-dom';
import { setFiles } from '../slice';
import { downloadFileById } from '../../../../actions/massLoadActions';
import { BlueButton } from '../../../../Components/Theme/Buttons/BlueButton';
import { GetAppRounded, SearchRounded } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';
import { useUnArchiningTkoQuery } from '../unarchive/api';

export const BasisDocumentField = ({isUnArchive}) => {
  const { uid } = useParams();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const { files } = useSelector(({ deletingTko }) => deletingTko);
  const { currentData: data1 } = useArchiningTkoQuery(uid, { skip: !uid || isUnArchive });
  const { currentData: data2 } = useUnArchiningTkoQuery(uid, { skip: !uid || !isUnArchive });
  const data = data1 || data2;
  const exportFileLog = useExportFileLog([isUnArchive ? 'Деархівація ТКО' : 'Демонтаж/Архівація']);

  const DOCUMENTS_NAMES =
    files?.map((f) => f.name)?.join() ??
    data?.additional_data?.documents_basis?.map((f) => f.file_original_name)?.join();

  const NO_DOCUMENTS = !data?.additional_data?.documents_basis || data?.additional_data?.documents_basis?.length === 0;

  const handleChangeFile = (event) => {
    const addedFiles = Array.prototype.slice.call(event.target.files);
    dispatch(setFiles(files ? [...files, ...addedFiles] : addedFiles));
  };

  const handleDownload = () => {
    data?.additional_data?.documents_basis?.forEach((file) => {
      dispatch(downloadFileById(file?.file_uid, file?.file_original_name));
      exportFileLog(uid);
    });
  };

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Box display={'flex'} gap={2} alignItems={'center'}>
        <StyledInput
          style={{ width: '250px' }}
          size={'small'}
          value={DOCUMENTS_NAMES}
          required={!uid}
          label={t('FIELDS.BASIS_DOCUMENT')}
          placeholder={t('FIELDS.BASIS_DOCUMENT')}
          readOnly
        />
        {!data ? (
          <>
            <input
              id={'file'}
              disabled={Boolean(data?.files)}
              type="file"
              multiple
              onClick={(event) => (event.currentTarget.value = null)}
              onChange={handleChangeFile}
            />
            <label htmlFor={'file'}>
              <BlueButton component={'span'}>
                <SearchRounded />
                <Typography noWrap>{t('CONTROLS.SELECT_FILES')}</Typography>
              </BlueButton>
            </label>
          </>
        ) : (
          <BlueButton onClick={handleDownload} disabled={NO_DOCUMENTS}>
            <GetAppRounded />
            <Typography>{t('CONTROLS.DOWNLOAD')}</Typography>
          </BlueButton>
        )}
      </Box>
    </Grid>
  );
};
