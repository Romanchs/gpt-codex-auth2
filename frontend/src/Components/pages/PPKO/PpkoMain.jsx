import IconButton from '@material-ui/core/IconButton';
import AddRounded from '@mui/icons-material/AddRounded';
import AssignmentRounded from '@mui/icons-material/AssignmentRounded';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  getPpkoList,
  getPublicationEmails,
  onPublication,
  setPpkoListParams,
  updatePublicationEmails
} from '../../../actions/ppkoActions';
import { checkPermissions } from '../../../util/verifyRole';
import Page from '../../Global/Page';
import { ModalWrapper } from '../../Modal/ModalWrapper';
import { BlueButton } from '../../Theme/Buttons/BlueButton';
import CircleButton from '../../Theme/Buttons/CircleButton';
import { GreenButton } from '../../Theme/Buttons/GreenButton';
import { WhiteButton } from '../../Theme/Buttons/WhiteButton';
import { Pagination } from '../../Theme/Table/Pagination';
import PpkoTable from './PpkoTable';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

const PpkoMain = () => {
  const { t } = useTranslation();
  const { loading, params, list, emails, publication } = useSelector((store) => store.ppko);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openSettings, setOpenSettings] = useState(false);
  const [publicationEmails, setPublicationEmails] = useState([]);
  const [openPublish, setOpenPublish] = useState(false);

  useEffect(() => {
    if (checkPermissions('PPKO.LIST.CONTROLS.EDIT_EMAILS', 'АКО_ППКО')) {
      dispatch(getPublicationEmails());
    }
  }, [dispatch, openSettings]);

  useEffect(() => {
    if (emails) {
      setPublicationEmails(emails);
    }
  }, [emails]);

  useEffect(() => {
    dispatch(getPpkoList(params));
  }, [dispatch, params]);

  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  const onPublickate = () => {
    setOpenPublish(false);
    dispatch(onPublication());
  };

  return (
    <Page
      pageName={t('PAGES.PPKO')}
      backRoute={'/'}
      loading={loading}
      acceptPermisions={'PPKO.ACCESS'}
      rejectRoles={['АКО_Суперечки', 'АКО_Перевірки', 'ГарПок']}
      faqKey={'INFORMATION_BASE__PPKO'}
      controls={
        <>
          {checkPermissions('PPKO.LIST.CONTROLS.SEND_PUBLICATION', 'АКО_ППКО') && (
            <CircleButton
              onClick={() => setOpenPublish(true)}
              type={publication ? 'loading' : 'send'}
              title={t('CONTROLS.SEND_PUBLICATION')}
              disabled={publication}
            />
          )}
          {checkPermissions('PPKO.LIST.CONTROLS.EDIT_EMAILS', 'АКО_ППКО') && (
            <CircleButton onClick={() => setOpenSettings(true)} type={'settings'} title={t('CONTROLS.EDIT_EMAILS')} />
          )}
          {checkPermissions('PPKO.HISTORY.ACCESS', 'АКО_ППКО') && (
            <CircleButton
              title={t('PAGES.HISTORY')}
              color={'blue'}
              icon={<AssignmentRounded />}
              onClick={() => navigate('/ppko/history')}
              dataMarker={'to-journal'}
            />
          )}
        </>
      }
    >
      <PpkoTable data={list?.data} params={params} />
      <Pagination
        {...list}
        params={params}
        onPaginate={(p) => dispatch(setPpkoListParams({ ...params, ...p }))}
        loading={loading}
        elementsName={t('PAGINATION.PPKO')}
      />
      <ModalWrapper header={t('MODALS.EMAILS_FOR_PUBLICATION')} open={openSettings} onClose={handleCloseSettings}>
        <ModalBody
          emails={publicationEmails}
          onUpdate={(emails) => setPublicationEmails(emails)}
          onCancel={() => {
            setTimeout(() => setPublicationEmails(emails), 100);
            handleCloseSettings();
          }}
          onSave={() => {
            dispatch(updatePublicationEmails({ emails: publicationEmails }));
            handleCloseSettings();
          }}
        />
      </ModalWrapper>
      <ModalWrapper
        header={<span>{t('MODALS.DO_YOU_WANT_TO_PUBLIC_NEW_PPKO_VERSION')}</span>}
        onClose={() => setOpenPublish(false)}
        open={openPublish}
      >
        <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'center'} spacing={3}>
          <BlueButton style={{ width: '42%' }} onClick={() => setOpenPublish(false)}>
            {t('CONTROLS.NO')}
          </BlueButton>
          <GreenButton style={{ width: '42%' }} onClick={onPublickate}>
            {t('CONTROLS.YES')}
          </GreenButton>
        </Stack>
      </ModalWrapper>
    </Page>
  );
};

export default PpkoMain;

const ModalBody = ({ emails, onUpdate, onCancel, onSave }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (String(email).length > 150) {
      setError(t('VERIFY_MSG.MAX_ADDRESS_LENGTH_150'));
      return false;
    }
    if (!re.test(String(email).toLowerCase())) {
      setError(t('VERIFY_MSG.UNCORRECT_ADDRESS'));
      return false;
    }
    if (emails.find((i) => String(i).toLowerCase() === String(email).toLowerCase())) {
      setError(t('VERIFY_MSG.ADDRESS_DUPLICATE'));
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    if (!showInput) {
      setShowInput(true);
    } else {
      if (validateEmail(value)) {
        onUpdate([...emails, value]);
        setValue('');
        setShowInput(false);
      }
    }
  };

  const handleChange = ({ target }) => {
    if (error) {
      setError('');
    }
    setValue(target.value.toLowerCase());
  };

  return (
    <div id={'ppko-emails-modal'}>
      {emails.map((email, emailIndex) => (
        <div className={'email-row'} key={emailIndex}>
          <p data-name="email-text">{email}</p>
          <IconButton onClick={() => onUpdate(emails.filter((i) => i !== email))} data-marker="email-delete">
            <DeleteOutlineRounded />
          </IconButton>
        </div>
      ))}
      <div className={`add${showInput ? ' open' : ''}${error ? ' error' : ''}`}>
        <input
          type="text"
          value={value}
          placeholder={t('FIELDS.ENTER_EMAIL')}
          onChange={handleChange}
          data-marker={'email-input'}
        />
        <GreenButton onClick={handleAdd}>
          <AddRounded />
          {t('CONTROLS.ADD')}
        </GreenButton>
        <span className={'error'}>{error}</span>
      </div>
      <div className={'controls'}>
        <WhiteButton onClick={onCancel}>{t('CONTROLS.CANCEL')}</WhiteButton>
        <BlueButton onClick={onSave}>{t('CONTROLS.SAVE')}</BlueButton>
      </div>
    </div>
  );
};
