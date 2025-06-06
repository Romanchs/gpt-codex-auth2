import Page from '../../../Components/Global/Page';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import Statuses from '../../../Components/Theme/Components/Statuses';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { DeletingTkoForm } from './deleting/DeletingTkoForm';
import { ArchivingTkoForm } from './archiving/ArchivingTkoForm';
import { process_types } from './data';
import { useDispatch, useSelector } from 'react-redux';
import { resetState, setProcessType } from './slice';
import { useCreateArchiningTkoMutation, useUploadBasisDocumentMutation } from './archiving/api';
import { useCreateDeletingTkoMutation } from './deleting/api';
import { checkPermissions } from '../../../util/verifyRole';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { UnArchiveForm } from './unarchive/UnArchiveForm';
import { useCreateUnArchiningTkoMutation, useUploadUnArchiveBasisDocumentMutation } from './unarchive/api';

export const DELETE_ACTIVATE_TKO_INITIALIZATION_ACCEPT_ROLES = ['АТКО', 'АКО_Процеси'];

const DeletingTko = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createDeleting, { isLoading: isCreating }] = useCreateDeletingTkoMutation({
    fixedCacheKey: 'createDeletingTko'
  });
  const [createArchiving, { isLoading: isCreatingArchiving }] = useCreateArchiningTkoMutation({
    fixedCacheKey: 'createArchivingTko'
  });
  const [createUnArchiving, { isLoading: isCreatingUnArchiving }] = useCreateUnArchiningTkoMutation({
    fixedCacheKey: 'createUnArchivingTko'
  });
  const [uploadBasisDocument, { isLoading: isUploading }] = useUploadBasisDocumentMutation();
  const [uploadUnArchiveBasisDocument, { isLoading: isUploadingUnArchiving }] = useUploadUnArchiveBasisDocumentMutation();

  const { reasonType, processType, reason, reasonInit, mpType, mustBeFinishedAt, files } = useSelector(
    (store) => store.deletingTko
  );

  const loading = isCreating || isCreatingArchiving || isCreatingUnArchiving || isUploading || isUploadingUnArchiving;

  const isDeletingDisabled = !mpType || !reasonType || (reasonType == 3 && !reason);
  const isArchivingDisabled =
    !mpType ||
    !reasonType ||
    (reasonType == 4 && !reason) ||
    !mustBeFinishedAt ||
    (checkPermissions('PROCESSES.DELETING_TKO.IS_AKO_PROCESSES', 'АКО_Процеси') && !files) ||
    ((checkPermissions('PROCESSES.DELETING_TKO.FIELDS.INITIATON_PROCESS', 'АКО_Процеси') ||
      (mustBeFinishedAt && moment(mustBeFinishedAt).isBefore(moment()))) &&
      !reasonInit);

  const isUnArchivingDisabled =
    !mpType ||
    (!checkPermissions('PROCESSES.DELETING_TKO.IS_AKO_PROCESSES', 'АКО_Процеси') && !reasonType)||
    (!checkPermissions('PROCESSES.DELETING_TKO.IS_AKO_PROCESSES', 'АКО_Процеси') && !reason)||
    !reasonInit ||
    (checkPermissions('PROCESSES.DELETING_TKO.IS_AKO_PROCESSES', 'АКО_Процеси') && !files)

  const isDisabledInit = {
    [process_types[0].value]: isDeletingDisabled,
    [process_types[1].value]: isArchivingDisabled,
    [process_types[2].value]: isUnArchivingDisabled,
  }

  useEffect(() => {
    if(checkPermissions('PROCESSES.DELETING_TKO.IS_AKO_PROCESSES', 'АКО_Процеси')) {
      dispatch(setProcessType(process_types[1].value))
    } 
    return () => dispatch(resetState());
  }, []);

  const handleStart = () => {
    if (processType === process_types[0].value) {
      handleCreateDeleting();
    }
    if (processType === process_types[1].value) {
      handleCreateArchiving();
    }
    if (processType === process_types[2].value) {
      handleCreateUnArchiving();
    }
  };

  const handleCreateArchiving = () => {
    let body = {
      process_type: processType,
      ap_status: 'Активована',
      mp_type: mpType,
      reason_type: reasonType,
      must_be_finished_at: mustBeFinishedAt,
      reason_init: reasonInit
    };
    if (reasonType === 4) {
      body = { ...body, reason };
    }
    createArchiving({ body }).then((res) => {
      if (res?.data?.uid) {
        if (files) {
          const formData = new FormData();
          files.map((file) => formData.append(`files`, file));
          uploadBasisDocument({ formData, uid: res?.data?.uid });
        }
        dispatch(resetState());
        navigate(`/processes/dismantle-archive-ap/${res.data.uid}`, { replace: true });
      }
    });
  };

  const handleCreateDeleting = () => {
    let body = {
      process_type: processType,
      ap_status: 'Активована',
      mp_type: mpType,
      reason_type: reasonType
    };
    if (reasonType === 3) {
      body = { ...body, reason };
    }
    createDeleting({ body }).then((res) => {
      if (res?.data?.uid) {
        dispatch(resetState());
        navigate(`/processes/deleting-tko/${res.data.uid}`, { replace: true });
      }
    });
  };

  const handleCreateUnArchiving = () => {
    let body = checkPermissions('PROCESSES.DELETING_TKO.IS_AKO_PROCESSES', 'АКО_Процеси') ? {
      mp_type: mpType,
      reason_init: reasonInit
    } : {
      mp_type: mpType,
      reason_type: reasonType,
      reason: reason,
      reason_init: reasonInit
    };
    createUnArchiving({ body }).then((res) => {
      if (res?.data?.uid) {
        if (files && checkPermissions('PROCESSES.DELETING_TKO.IS_AKO_PROCESSES', 'АКО_Процеси')) {
          const formData = new FormData();
          files.map((file) => formData.append(`files`, file));
          uploadUnArchiveBasisDocument({ formData, uid: res?.data?.uid }).then(() => {
            dispatch(resetState());
            navigate(`/processes/unarchive-ap/${res.data.uid}`, { replace: true });
          });
        } else {
          dispatch(resetState());
          navigate(`/processes/unarchive-ap/${res.data.uid}`, { replace: true });
        }
      }
    })
  }

  const getFormByProcessType = (type) => {
    if (type === process_types[0].value) {
      return <DeletingTkoForm />;
    }
    if (type === process_types[1].value) {
      return <ArchivingTkoForm />;
    }
    if (type === process_types[2].value) {
      return <UnArchiveForm />;
    }
    return null;
  };

  return (
    <Page
      pageName={t(processType === process_types[2].value ? 'SUBPROCESSES.UNARCHIVE_AP' : 'PROCESSES.DELETE_ACTIVATE_TKO')}
      backRoute={'/processes'}
      faqKey={'PROCESSES__DELETE_ACTIVATE_TKO'}
      loading={loading}
      acceptPermisions={'PROCESSES.DELETING_TKO.INITIALIZATION'}
      acceptRoles={DELETE_ACTIVATE_TKO_INITIALIZATION_ACCEPT_ROLES}
      controls={
        <CircleButton
          type={'create'}
          dataMarker={'deleting-tko-take-to-work'}
          title={t('CONTROLS.TAKE_TO_WORK')}
          onClick={handleStart}
          disabled={isDisabledInit[processType]}
        />
      }
    >
      <Statuses
        statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'PARTIALLY_DONE', 'COMPLETED', 'REJECTED', 'CANCELED']}
        currentStatus={'NEW'}
      />
      {getFormByProcessType(processType)}
    </Page>
  );
};

export default DeletingTko;
