import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { checkPermissions } from '../../../util/verifyRole';
import Page from '../../../Components/Global/Page';
import CancelModal from '../../../Components/Modal/CancelModal';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import Statuses from '../../../Components/Theme/Components/Statuses';
import { AkoReprocessing } from '../components/Modals/AkoReprocessing';
import { TransferToAko } from '../components/Modals/TransferToAko';
import { ProcessedModal } from '../components/ProcessedModal/ProcessedModal';
import { ReProcessedModal } from '../components/ReProcessedModal/ReProcessedModal';
import {
  ACTION,
  ACTIONS_MAP,
  AKO_STATUSES,
  ALLOWED_STATUSES,
  DATA_TYPES,
  DISPUTE_ALLOWED_ROLES,
  SECTIONS
} from '../constants';
import { disputesActions } from '../disputes.slice';
import { DisputesEntityTkoAko } from './DisputesEntityTkoAko';
import { DisputesEntityTkoChars } from './DisputesEntityTkoChars';
import { DisputesEntityTkoFiles } from './DisputesEntityTkoFiles';
import { DisputesEntityTkoHistory } from './DisputesEntityTkoHistory';
import { DHTab, DHTabs } from '../../../Components/pages/Processes/Components/Tabs';
import { FormTKO } from './FormTKO';
import { ImportModal } from '../components/Modals/ImportModal';
import { useTranslation } from 'react-i18next';
import DisputesEntityChangeRequest from './DisputesEntityChangeRequest';

const getSections = (status) => [
  { section: SECTIONS.CHARS, label: 'CONFLICTS_CHARACTERISTICS', visible: true },
  { section: SECTIONS.FILES, label: 'DISPUTE_FILES', visible: true },
  { section: SECTIONS.HISTORY, label: 'STATUSES_HISTORY', visible: true },
  { section: SECTIONS.AKO, label: 'CHARACTERISTICS.AKO', visible: Boolean(AKO_STATUSES.includes(status)) },
  { section: SECTIONS.CHANGE_REQUEST, label: 'CHANGE_REQUEST', visible: true }
];

const getStatuses = (status) => {
  if (!status) {
    return [];
  }

  return AKO_STATUSES.includes(status) ? AKO_STATUSES : ALLOWED_STATUSES;
};

const selectActions = (actions = [], activeSection) => {
  return actions.filter(
    (action) =>
      Boolean(ACTIONS_MAP[action]) &&
      (ACTIONS_MAP[action].visibleForSection === activeSection || !ACTIONS_MAP[action].visibleForSection)
  );
};

export const DisputesEntityTko = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalState, setModalState] = useState({
    text: '',
    action: ''
  });

  const [property, setProperty] = useState({});

  const { uid, section = SECTIONS.CHARS } = useParams();
  const {
    activeRoles: [{ relation_id }]
  } = useSelector(({ user }) => user);
  const { loading, uploading, error, disputeEntity, atkoExecuted } = useSelector(({ disputes }) => disputes);
  const statuses = getStatuses(disputeEntity?.status);
  const sections = getSections(disputeEntity?.status);

  const hasDecisionSend = disputeEntity?.actions?.includes(ACTION.AKO_DECISION_SEND);

  useEffect(() => {
    if (!checkPermissions('DISPUTES.TKO_ENTITY.ACCESS', DISPUTE_ALLOWED_ROLES)) {
      navigate('/');
    }

    dispatch(disputesActions.getEntity({ uid }))
      .unwrap()
      .catch(() => {
        navigate('/disputes');
      });
  }, [dispatch, navigate, uid, relation_id]);

  useEffect(() => {
    if (disputeEntity?.data_type === DATA_TYPES.DRAFT) {
      navigate('create');
    }
  }, [navigate, disputeEntity]);

  const handleActionClick = (action) => async () => {
    const isProcessing = [
      ACTION.CANCEL,
      ACTION.PROCESSED,
      ACTION.REPROCESSING,
      ACTION.TRANSFER_TO_AKO,
      // Custom
      ACTION.UPLOAD,
      ACTION.UPLOAD_AKO,
      ACTION.EDIT_PROPERTY,
      ACTION.AKO_RESOLVED
    ].includes(action);

    if ([ACTION.APPROVE, ACTION.CONTINUE, ACTION.TO_WORK, ACTION.AKO_TO_WORK, ACTION.RESOLVED].includes(action)) {
      return dispatch(disputesActions.doAction({ uid, action }));
    }

    if (isProcessing) {
      return setModalState({
        text: t(ACTIONS_MAP[action]?.text),
        action
      });
    }
  };

  const handleModalCancelClick = () => {
    setModalState(null);
  };

  const handleModalAcceptClick = async (params) => {
    await dispatch(disputesActions.doAction({ uid, action: modalState?.action, params }));
    handleModalCancelClick();
  };

  const handleTabChange = (_, section) => {
    navigate(`/disputes/tko/${uid}/${section}`, { replace: true });
  };

  const selectPageName = ({ id, description } = {}) => {
    if (id && description) {
      return t('PAGES.DISPUTE_BY_DESCRIPTION_WITH_ID', { description, id });
    } else if (id) {
      return t('PAGES.DISPUTE_WITH_ID', { id });
    }

    return t('PAGES.DISPUTE');
  };

  return (
    <Page
      pageName={selectPageName(disputeEntity)}
      notFoundMessage={!loading && !disputeEntity.id && t('DISPUTE_NOT_FOUND')}
      backRoute={'/disputes'}
      loading={loading}
      controls={selectActions(disputeEntity?.actions, section).map((key) => (
        <CircleButton
          key={key}
          {...ACTIONS_MAP[key]}
          title={t(ACTIONS_MAP[key].title)}
          disabled={loading}
          onClick={handleActionClick(key)}
        />
      ))}
    >
      <Statuses statuses={statuses} currentStatus={disputeEntity.status} />
      {!loading && (
        <div className={'boxShadow'} style={{ paddingLeft: 24, paddingRight: 24, marginTop: 16, marginBottom: 16 }}>
          <DHTabs value={section || SECTIONS.CHARS} onChange={handleTabChange}>
            {sections
              .filter((section) => section.visible)
              .map(({ section, label }) => (
                <DHTab label={t(label)} value={section} key={section} />
              ))}
          </DHTabs>
        </div>
      )}
      {section !== SECTIONS.CHANGE_REQUEST && (
        <div className={'boxShadow'} style={{ padding: 24 }}>
          <FormTKO disputeEntity={disputeEntity} />
        </div>
      )}
      {!loading && (
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          {section === SECTIONS.CHARS && (
            <DisputesEntityTkoChars
              disputeEntity={disputeEntity}
              onApply={(p) => {
                dispatch(
                  disputesActions.updateProperty({
                    uid: disputeEntity.uid,
                    params: {
                      tko_properties: {
                        [p.property_code]:
                          disputeEntity.data_type === DATA_TYPES.FORMED_INITIATOR
                            ? p.by_executor
                            : disputeEntity.data_type === DATA_TYPES.FORMED_EXECUTOR
                            ? p.by_initiator
                            : p.by_executor
                      }
                    }
                  })
                );
              }}
              onEdit={(p) => {
                setProperty(p);
                handleActionClick(ACTION.EDIT_PROPERTY)();
              }}
            />
          )}
          {section === SECTIONS.FILES && <DisputesEntityTkoFiles files={disputeEntity?.files} />}
          {section === SECTIONS.HISTORY && <DisputesEntityTkoHistory disputeEntity={disputeEntity} />}
          {section === SECTIONS.AKO && (
            <DisputesEntityTkoAko
              uid={disputeEntity?.uid}
              status={disputeEntity?.status}
              {...disputeEntity?.ako}
              hasDecisionSend={hasDecisionSend}
            />
          )}
          {section === SECTIONS.CHANGE_REQUEST && <DisputesEntityChangeRequest list={disputeEntity?.subprocess} />}
        </div>
      )}
      <CancelModal
        text={modalState?.text}
        open={modalState?.action === ACTION.CANCEL}
        onClose={handleModalCancelClick}
        onSubmit={() => handleModalAcceptClick()}
      />
      <ProcessedModal
        disputeEntity={disputeEntity}
        open={[ACTION.CONTINUE, ACTION.PROCESSED, ACTION.REPROCESSING, ACTION.APPROVE].includes(modalState?.action)}
        onClose={handleModalCancelClick}
        onSubmit={handleModalAcceptClick}
      />
      <ReProcessedModal
        disputeEntity={disputeEntity}
        property={property}
        open={modalState?.action === ACTION.EDIT_PROPERTY}
        onClose={handleModalCancelClick}
        onSubmit={handleModalCancelClick}
      />
      <TransferToAko
        open={modalState?.action === ACTION.TRANSFER_TO_AKO}
        onClose={handleModalCancelClick}
        onSubmit={handleModalAcceptClick}
      />
      <AkoReprocessing
        open={modalState?.action === ACTION.AKO_RESOLVED}
        addFile
        fileMaxSize={26214400}
        acceptTypes={['.pdf','.zip']}
        onClose={handleModalCancelClick}
        onSubmit={(message, file) => {
          if(!file) { 
            return handleModalAcceptClick({ message, atko_executed: atkoExecuted || disputeEntity?.ako?.decision_executed });
          }
          dispatch(
            disputesActions.uploadFile({
              uid,
              data: file
            })
          ).then(
            handleModalAcceptClick({ message, atko_executed: atkoExecuted || disputeEntity?.ako?.decision_executed })
          )
        }}
      />
      <ImportModal
        open={modalState?.action === ACTION.UPLOAD || modalState?.action === ACTION.UPLOAD_AKO}
        loading={uploading}
        error={error}
        onClose={handleModalCancelClick}
        onUpload={(data) =>
          dispatch(
            disputesActions.uploadFile({
              uid,
              data
            })
          ).then(handleModalCancelClick)
        }
        types={null}
      />
    </Page>
  );
};
