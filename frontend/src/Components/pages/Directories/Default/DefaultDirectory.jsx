import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { WhiteButton } from '../../../Theme/Buttons/WhiteButton';
import { NotFoundPage } from '../../../errors/NotFoundPage';
import { GreenButton } from '../../../Theme/Buttons/GreenButton';
import AddRounded from '@mui/icons-material/AddRounded';
import { ModalWrapper } from '../../../Modal/ModalWrapper';
import { checkPermissions } from '../../../../util/verifyRole';
import DirectoryTable from '../DirectoryTable';
import { Pagination } from '../../../Theme/Table/Pagination';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import {
  addItemToDirectory,
  clearDirectoryListParams,
  download,
  getDirectoryById,
  setDirectoryListParams
} from '../../../../actions/directoriesActions';
import Page from '../../../Global/Page';
import { Box, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

const DefaultDirectory = () => {
  const { t, i18n } = useTranslation();
  const isUA = i18n.language === 'ua';
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, params, selectedDirectory, downloading, error } = useSelector((s) => s.directories);
  const [open, setOpen] = useState(false);
  const [addForm, setAddForm] = useState({});
  const [errors, setErrors] = useState({});
  const classes = useStyles();

  const IS_REF = selectedDirectory?.reference_type?.code === '106-12' || selectedDirectory?.reference_type?.code === '106-13'

  useEffect(() => {
      dispatch(getDirectoryById(id, params));
  }, [dispatch, id, params, navigate]);

  useEffect(
    () => () => {
      dispatch(clearDirectoryListParams());
    },
    [dispatch]
  );

  useEffect(() => {
    if (open) {
      setOpen(false);
      setAddForm({});
    }
  }, [selectedDirectory]);

  useEffect(() => {
    if (error?.response?.data) {
      setErrors(error?.response?.data);
    }
  }, [error]);

  if (error?.response?.status === 404) {
    return <NotFoundPage message={t('DIRECTORY_NOT_FOUND')} />;
  }

  const headerString = loading
    ? `${t('LOAD_DIRECTORY')}...`
    : isUA
    ? `${selectedDirectory?.reference_type?.code} ${selectedDirectory?.reference_type?.name_ua} / ${selectedDirectory?.reference_type?.name_en}`
    : `${selectedDirectory?.reference_type?.code} ${selectedDirectory?.reference_type?.name_en}`;

  const handleChange = (name, value) => {
    if (errors[name]) {
      setErrors({ ...errors, [name]: [] });
    }
    setAddForm({ ...addForm, [name]: value });
  };

  const handleAdd = () => {
    dispatch(addItemToDirectory({ ...addForm, reference_type: id }));
  };

  const handleDownload = () => {
    if (selectedDirectory) {
      dispatch(
        download(id, `DATAHUB-${selectedDirectory?.reference_type?.code}-${selectedDirectory?.reference_type?.name_ua}`)
      );
    }
  };

  return (
    <Page
      pageName={headerString}
      backRoute={'/directories'}
      loading={loading}
      controls={
        <CircleButton
          onClick={handleDownload}
          type={'download'}
          title={t('CONTROLS.DOWNLOAD_DIRECTORY')}
          disabled={downloading}
        />
      }
    >
      <DirectoryTable
        selectedDirectory={selectedDirectory}
        default_for_validation={selectedDirectory?.reference_type?.additional_data?.default_for_validation}
      />
      <ModalWrapper open={open} onClose={() => setOpen(false)} header={t('UPDATE_DIRECTORY')}>
        <Box sx={{ pt: 3 }}>
          {selectedDirectory?.reference_type?.title?.map((title) => (
            <div className={classes.addField} key={`field-${title?.params}`}>
              <p>{title?.name}</p>
              <input
                type="text"
                value={addForm[title?.params] || ''}
                onChange={({ target }) => handleChange(title?.params, target.value)}
              />
              {errors && errors[title?.params] && <p className={'danger'}>{errors[title?.params]}</p>}
            </div>
          ))}
        </Box>
        <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={1}>
          <WhiteButton onClick={() => setOpen(false)}>{t('CONTROLS.CANCEL')}</WhiteButton>
          <GreenButton onClick={handleAdd} disabled={Object.values(addForm).filter((i) => Boolean(i)).length === 0}>
            {t('CONTROLS.ADD')}
          </GreenButton>
        </Stack>
      </ModalWrapper>
      <Pagination
        {...selectedDirectory}
        loading={loading}
        params={params}
        onPaginate={(p) => dispatch(setDirectoryListParams({ ...params, ...p }))}
        elementsName={t('PAGINATION.ELEMENTS')}
      >
        {checkPermissions('DIRECTORIES.DEFAULT.FUNCTIONS.ADD', 'АКО_Довідники') && !IS_REF && (
          <GreenButton onClick={() => setOpen(true)}>
            <AddRounded />
            {t('CONTROLS.ADD')}
          </GreenButton>
        )}
      </Pagination>
    </Page>
  );
};

export default DefaultDirectory;

const useStyles = makeStyles(() => ({
  add: {
    marginTop: 24
  },
  addField: {
    width: 320,
    marginBottom: 12,
    '&>p': {
      color: '#567691',
      fontSize: 12,
      paddingLeft: 5,
      paddingBottom: 5,
      '&.danger': {
        fontSize: 10,
        color: '#f90000'
      }
    },
    '&>input': {
      width: '100%',
      color: '#666',
      border: '1px solid #D1EDF3',
      outline: 'none',
      padding: '5px 7px',
      fontSize: 13,
      borderRadius: 4
    }
  }
}));
