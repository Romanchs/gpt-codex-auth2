import Grid from '@material-ui/core/Grid';

import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';
import * as moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { cancelPonProcess, exportPonTko, getPonById } from '../../../../actions/ponActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import { ModalWrapper } from '../../../Modal/ModalWrapper';
import { BlueButton } from '../../../Theme/Buttons/BlueButton';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import { DangerButton } from '../../../Theme/Buttons/DangerButton';
import StyledInput from '../../../Theme/Fields/StyledInput';
import PonDetail from './PonDetail';
import DelegateBtn from '../../../../features/delegate/delegateBtn';
import DelegateInput from '../../../../features/delegate/delegateInput';
import Statuses from '../../../Theme/Components/Statuses';
import { useTranslation } from 'react-i18next';
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';

const useStyles = makeStyles(() => ({
  title: {
    marginTop: 24,
    color: '#0D244D',
    fontSize: 15,
    lineHeight: 1.2,
    fontWeight: 400,
    marginBottom: 16,
    paddingLeft: 4
  },
  whiteBlock: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    '&>p': {
      color: '#567691',
      fontSize: 12,
      width: '80%'
    },
    '&>span': {
      color: '#223B82',
      fontSize: 12,
      fontWeight: 700
    }
  },
  owner: {
    marginTop: 24
  }
}));

export const CREATE_PON_ACCEPT_ROLES = ['АКО', 'АКО_Процеси', 'АКО_ППКО', 'АКО_Користувачі', 'АКО_Довідники', 'СВБ'];

const CreatedPON = ({ dispatch, ponLoading, ponData, canceledPon, activeRoles, notFound }) => {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const navigate = useNavigate();
  const { uid } = useParams();
  const [cancelingProcess, setCancelingProcess] = useState(false);
  const [delegating, setDelegating] = useState(false);

  const exportFileLog = useExportFileLog(['Заявка на зміну СВБ на ПОН/ПУП']);

  useEffect(() => {
    if (checkPermissions('PROCESSES.PON.MAIN.ACCESS', CREATE_PON_ACCEPT_ROLES)) {
      dispatch(getPonById(uid));
    } else {
      navigate('/processes');
    }
  }, [dispatch, navigate, uid, activeRoles, canceledPon]);

  const handleOnCancel = () => {
    dispatch(cancelPonProcess(uid));
    setCancelingProcess(false);
  };

  const handleDownload = (filename, type_report) => {
    dispatch(exportPonTko(uid, filename, { type_report }));
    exportFileLog(uid);
  };

  return (
    <Page
      pageName={ponData?.id ? t('PAGES.PON_ID', { id: ponData?.id }) : t('PAGES.PON')}
      backRoute={'/processes'}
      loading={ponLoading || delegating}
      faqKey={'PROCESSES__CHANGE_SUPPLIER_TO_PON'}
      notFoundMessage={notFound && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          <CircleButton
            type={'remove'}
            title={t('CONTROLS.CANCEL_PROCESS')}
            disabled={!ponData?.could_cancel}
            onClick={() => setCancelingProcess(true)}
          />
          <CircleButton type={'refresh'} title={t('CONTROLS.REFRESH')} onClick={() => dispatch(getPonById(uid))} />
          {ponData?.can_delegate && (
            <DelegateBtn
              process_uid={uid}
              onStarted={() => setDelegating(true)}
              onFinished={() => setDelegating(false)}
              onSuccess={() => window.location.reload()}
            />
          )}
        </>
      }
    >
      <Statuses statuses={['NEW', 'IN_PROCESS', 'DONE', 'CANCELED']} currentStatus={ponData?.status} />
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16 }}>
        <Grid container alignItems={'flex-start'} spacing={3}>
          <Grid item xs={12} md={6}>
            <StyledInput label={t('FIELDS.CURRENT_SUPPLIER')} value={ponData?.current_supplier?.short_name} disabled />
          </Grid>
          <Grid item xs={12} md={3} lg={2}>
            <StyledInput label={t('FIELDS.USREOU')} value={ponData?.current_supplier?.usreou} disabled />
          </Grid>
          <Grid item xs={12} md={3} lg={2}>
            <StyledInput label={t('FIELDS.EIC_CODE_INITIATOR')} value={ponData?.current_supplier?.eic} disabled />
          </Grid>
          {ponData?.pre_default_entry_date && (
            <Grid item xs={12} md={3} lg={2}>
              <StyledInput
                label={t('SUPPLIERS.DATE_OF_ENTRY_INTO_PRE_DEFAULT')}
                value={moment(ponData?.pre_default_entry_date).format('DD.MM.YYYY')}
                disabled
              />
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <StyledInput
              label={t('FIELDS.SUPPLIER_LAST_RESORT_NAME')}
              value={ponData?.supplier_last_resort_name}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={
                ponData?.pre_default_entry_date || ponData?.default_entry_date
                  ? t('FIELDS.APPROXIMATE_DATE_OF_TERMINATION_SUPPLY')
                  : t('FIELDS.DATE_OF_TERMINATION_SUPPLY')
              }
              value={ponData?.termination_supply_at && moment(ponData?.termination_supply_at).format('DD.MM.YYYY')}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.REASON_TERMINATION_SUPPLY')}
              value={ponData?.[`reason_termination_supply_${i18n.language}`]}
              disabled
            />
          </Grid>
          {ponData?.default_entry_date && (
            <Grid item xs={12} md={3}>
              <StyledInput
                label={
                  ponData?.pre_default_entry_date || ponData?.default_entry_date
                    ? t('FIELDS.APPROXIMATE_DEFAULT_ENTRY_DATE')
                    : t('FIELDS.DEFAULT_ENTRY_DATE')
                }
                value={ponData?.default_entry_date && moment(ponData?.default_entry_date).format('DD.MM.YYYY')}
                disabled
              />
            </Grid>
          )}
        </Grid>
      </div>
      {checkPermissions('PROCESSES.PON.MAIN.FUNCTIONS.SHOW_DETAILS', 'СВБ', true) && <PonDetail {...ponData} />}
      <h4 className={classes.title}>{t('PON.TRANSFER_TO_PON')}:</h4>
      <Grid container spacing={2} alignItems={'stretch'}>
        {[
          {
            title: t('PON.TKO_NUMBER_INITIATION'),
            key: 'tko_number_initiation'
          },
          {
            title: t('PON.AP_NUMBER_MOVE_TO_PON'),
            key: 'tko_number_move_to_pon'
          },
          {
            title: t('PON.TKO_NUMBER_NOT_MOVE_TO_PON'),
            key: 'tko_number_not_move_to_pon'
          }
        ].map(({ title, key }) => {
          return (
            <Grid item xs={12} md={4} key={key}>
              <div className={clsx(classes.whiteBlock, 'boxShadow')}>
                <p>{title}:</p>
                <span data-marker={key}>{ponData?.[key] || 0}</span>
                <CircleButton
                  type={'download'}
                  title={t('CONTROLS.DOWNLOAD')}
                  disabled={ponData?.[key] === 0}
                  size={'small'}
                  onClick={() => handleDownload(title, key)}
                />
              </div>
            </Grid>
          );
        })}
      </Grid>
      <div className={clsx(classes.owner, 'boxShadow')} style={{ padding: 24 }}>
        <Grid container spacing={2} alignItems={'center'}>
          <Grid item xs={12} md={6}>
            <DelegateInput
              label={t('FIELDS.USER_INITIATOR')}
              disabled
              value={ponData?.initiator}
              data={ponData?.delegation_history || []}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.CREATED_AT')}
              value={ponData?.created_at && moment(ponData?.created_at).format('DD.MM.YYYY  •  HH:mm')}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={ponData?.status.startsWith('CANCELED') ? t('FIELDS.CANCELED_AT') : t('FIELDS.COMPLETE_DATETIME')}
              value={ponData?.finished_at && moment(ponData?.finished_at).format('DD.MM.YYYY • HH:mm')}
              disabled
            />
          </Grid>
        </Grid>
      </div>
      <ModalWrapper
        header={
          <>
            {t('MODALS.IT_WILL_NOT_BE_POSSIBLE_TO_RESUME_PROCESS')} <br />
            {t('MODALS.ARE_YOU_SURE_YOU_WANT_TO_CANCEL_IT')}
          </>
        }
        open={cancelingProcess}
        onClose={() => setCancelingProcess(false)}
      >
        <Grid container spacing={3} alignItems={'center'} justifyContent={'space-between'} style={{ marginTop: 24 }}>
          <Grid item xs={6}>
            <BlueButton onClick={() => setCancelingProcess(false)} color="primary" style={{ width: '100%' }}>
              {t('CONTROLS.NO')}
            </BlueButton>
          </Grid>
          <Grid item xs={6}>
            <DangerButton onClick={handleOnCancel} color="primary" style={{ width: '100%' }}>
              {t('CONTROLS.YES')}
            </DangerButton>
          </Grid>
        </Grid>
      </ModalWrapper>
    </Page>
  );
};

const mapStateToProps = ({ pon, user }) => {
  return {
    error: pon.error,
    notFound: pon.notFound,
    ponLoading: pon.ponLoading,
    ponData: pon.ponData,
    canceledPon: pon.canceledPon,
    activeRoles: user.activeRoles
  };
};

export default connect(mapStateToProps)(CreatedPON);
