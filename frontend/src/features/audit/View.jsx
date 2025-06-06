import React, { useEffect, useMemo, useState } from 'react';
import Page from '../../Components/Global/Page';
import { useTranslation } from 'react-i18next';
import { AUDITS_READ_PERMISSION, AUDITS_READ_ROLES, AUDITS_WRITE_PERMISSION, AUDITS_WRITE_ROLES } from './index';
import {
  useAuditCheckMutation,
  useAuditQuery,
  useCancelAuditMutation,
  useDeleteAuditMutation,
  useLazyPrepareActQuery,
  useUpdateAuditMutation
} from './api';
import MainAccordion from './components/View/MainAccordion';
import { checkPermissions } from '../../util/verifyRole';
import { setViewData, useAuditApsData, useAuditViewData } from './slice';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import { useNavigate, useParams } from 'react-router-dom';
import CancelModal from '../../Components/Modal/CancelModal';
import GeneralInfoAccordion from './components/View/GeneralInfoAccordion';
import ActivityAccordion from './components/View/ActivityAccordion';
import ApsAccordion from './components/View/ApsAccordion';
import ResultsAccordion from './components/View/ResultsAccordion';
import StyledInput from '../../Components/Theme/Fields/StyledInput';
import CancellationData from './components/View/CancellationData';
import { useDispatch } from 'react-redux';
import WarningCheckModal from './components/View/modals/WarningCheckModal';
import moment from 'moment';

const STATUSES = {
  NEW: 'NEW',
  SCHEDULED: 'SCHEDULED',
  CANCELED: 'CANCELED',
  COMPLETED: 'COMPLETED',
  CURRENT: 'CURRENT'
};

const View = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uid } = useParams();
  const { data: fetchedData, isFetching } = useAuditQuery(uid);
  const data = useAuditViewData();
  const aps = useAuditApsData();
  const isNew = data?.status === STATUSES.NEW;
  const isCanceled = data?.status === STATUSES.CANCELED;
  const isCompleted = data?.status === STATUSES.COMPLETED;
  const isScheduled = data?.status === STATUSES.SCHEDULED;
  const isEditable = !isCanceled && checkPermissions(AUDITS_WRITE_PERMISSION, AUDITS_WRITE_ROLES);
  const showBtns = data && data?.uid === uid && !isFetching && isEditable;
  const canDelete = showBtns && isNew;
  const canCancel = showBtns && isScheduled;
  const [onDelete, { isLoading: isDeleting }] = useDeleteAuditMutation();
  const [onUpdate, { isLoading }] = useUpdateAuditMutation({ fixedCacheKey: 'audit-update' });
  const [onCancel, { isLoading: isCanceling }] = useCancelAuditMutation();
  const [onPrepareAct, { isFetching: isPreparing }] = useLazyPrepareActQuery();
  const [auditCheck, { isLoading: isChecking }] = useAuditCheckMutation();
  const [openDelete, setOpenDelete] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [openSave, setOpenSave] = useState(false);
  const [openWarningCheck, setOpenWarningCheck] = useState(false);
  const [reason, setReason] = useState('');

  const disableSave = useMemo(() => {
    if (JSON.stringify(aps) !== JSON.stringify(fetchedData?.aps)) return false;

    if (JSON.stringify(data) === JSON.stringify(fetchedData)) {
      return true;
    }
    const dates = [
      data?.audit_period_start,
      data?.audit_period_end,
      data?.date_start,
      data?.date_end,
      data?.legal_info?.notification_date,
      data?.legal_info?.referral_date,
      data?.legal_info?.inspection_date,
      data?.legal_info?.notice_date,
      data?.legal_info?.notice_executed,
      data?.legal_info?.notice_closed,
      data?.general_info?.registered,
      data?.general_info?.as_commissioning_date
    ];
    if ((!data?.audit_period_start || !data?.audit_period_end) && data?.audit_type !== 'SCHEDULED') {
      return true;
    }
    if (!data?.manager || !data?.date_start || !data?.date_end) {
      return true;
    }
    if (data?.auditor.length === 0) {
      return true;
    }
    if (
      (data?.legal_info?.taken_out_reason && !data?.legal_info?.taken_out_date) ||
      (!data?.legal_info?.taken_out_reason && data?.legal_info?.taken_out_date)
    )
      return true;

    if (data?.legal_info?.taken_out_reason && data?.legal_info?.taken_out_reason?.length < 10) return true;

    return !!dates.find((i) => i === 'Invalid date');
  }, [data, aps, fetchedData]);

  const canCreateNotifacation = useMemo(() => {
    return (fetchedData?.status === STATUSES.COMPLETED || fetchedData?.status === STATUSES.CURRENT)
      && !fetchedData?.child
      && fetchedData?.legal_info?.notice_number 
      && fetchedData?.legal_info?.notice_closed 
      && moment(fetchedData?.legal_info?.notice_closed).isBefore(moment(), 'date') 
      && fetchedData?.legal_info?.notice_number === data?.legal_info?.notice_number 
      && fetchedData?.legal_info?.notice_closed === data?.legal_info?.notice_closed;
  }, [data, fetchedData]);

  useEffect(() => {
    if (fetchedData) {
      dispatch(setViewData(fetchedData));
    }
  }, [fetchedData]);

  const handleDelete = () => {
    onDelete(uid).then((res) => {
      if (!res?.error) {
        navigate('/audits');
      }
    });
  };

  const handleCancel = () => {
    onCancel({ uid, body: { cancellation_data: { reason } } }).then(() => {
      setOpenCancel(false);
      setReason('');
    });
  };

  const handleSave = () => {
    onUpdate({ uid, body: { ...data, aps } }).then(() => {
      setOpenSave(false);
    });
  };

  const handleApprove = () => {
    onUpdate({ uid, body: { ...fetchedData, status: STATUSES.SCHEDULED } });
  };

  const handlePrepareAct = () => {
    onPrepareAct(uid);
  };

  const handleWarningCheck = () => {
    setOpenWarningCheck(true);
  }

  const handleCreateWarningCheck = (body) => {
    auditCheck({uid, body}).then(() =>  setOpenWarningCheck(false));
  }

  return (
    <Page
      pageName={t('PAGES.AUDIT_VIEW')}
      backRoute={'/audits'}
      loading={isFetching || isDeleting || isLoading || isCanceling || isPreparing || isChecking}
      acceptRoles={AUDITS_READ_ROLES}
      acceptPermisions={AUDITS_READ_PERMISSION}
      controls={
        <>
          {canDelete && (
            <CircleButton type={'delete'} title={t('CONTROLS.DELETE_AUDIT')} onClick={() => setOpenDelete(true)} />
          )}
          {canCancel && (
            <CircleButton type={'remove'} title={t('CONTROLS.CANCEL_AUDIT')} onClick={() => setOpenCancel(true)} />
          )}
          {showBtns && isCompleted && (
            <CircleButton type={'download'} title={t('CONTROLS.CREATE_AN_INSPECTION_ACT')} onClick={handlePrepareAct} />
          )}
          {showBtns && (
            <CircleButton
              type={'save'}
              title={t('CONTROLS.SAVE')}
              onClick={() => setOpenSave(true)}
              disabled={disableSave}
            />
          )}
          {showBtns && isNew && (
            <CircleButton type={'like'} title={t('CONTROLS.CONFIRM_AUDIT')} onClick={handleApprove} />
          )}
          {showBtns && canCreateNotifacation && (
            <CircleButton type={'eventNote'} title={t('CONTROLS.WARNING_CHECK')} onClick={handleWarningCheck} />
          )}
        </>
      }
    >
      {isCanceled && <CancellationData />}
      <MainAccordion />
      <GeneralInfoAccordion />
      <ActivityAccordion />
      <ApsAccordion />
      <ResultsAccordion />
      <CancelModal
        text={t('AUDIT.CONFIRM_DELETE_AUDIT')}
        open={openDelete}
        onSubmit={handleDelete}
        onClose={() => setOpenDelete(false)}
      />
      <CancelModal
        text={t('AUDIT.CONFIRM_CANCELL_AUDIT')}
        open={openCancel}
        submitType={'green'}
        onSubmit={handleCancel}
        onClose={() => setOpenCancel(false)}
        disabledSubmit={reason?.length < 10 || reason?.length > 200}
      >
        <StyledInput
          required
          label={t('FIELDS.COMMENT')}
          value={reason}
          onChange={({ target }) => setReason(target.value)}
          multiline
          helperText={t('AUDIT.CANCELL_AUDIT_MESSAGE')}
        />
      </CancelModal>
      <CancelModal
        text={t('AUDIT.CONFIRM_CHANGES')}
        open={openSave}
        onSubmit={handleSave}
        onClose={() => setOpenSave(false)}
      />
      <WarningCheckModal 
        open={openWarningCheck} 
        onClose={() => setOpenWarningCheck(false)}
        onSubmit={handleCreateWarningCheck}
      />
    </Page>
  );
};

export default View;
