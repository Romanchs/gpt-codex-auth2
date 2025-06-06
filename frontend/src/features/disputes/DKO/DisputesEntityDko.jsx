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
import { ACTION, ACTIONS_MAP, AKO_STATUSES, ALLOWED_STATUSES, DISPUTE_ALLOWED_ROLES, SECTIONS } from '../constants';
import { disputesActions } from '../disputes.slice';
import { DisputesEntityDkoAko } from './DisputesEntityDkoAko';
import { DisputesEntityDkoHistory } from './DisputesEntityDkoHistory';
import { DisputesEntityDkoFiles } from './DisputesEntityDkoFiles';
import { FormDko } from './FormDko';
import { DHTab, DHTabs } from '../../../Components/pages/Processes/Components/Tabs';
import { ImportModal } from '../components/Modals/ImportModal';
import { useTranslation } from 'react-i18next';

const getSections = (status) => [
  { section: SECTIONS.PROPOSE, label: 'OFFER_DKO', visible: true },
  { section: SECTIONS.CONFLICT, label: 'CONFLICTS_CHARACTERISTICS', visible: true },
  { section: SECTIONS.FILES, label: 'DISPUTE_FILES', visible: true },
  { section: SECTIONS.HISTORY, label: 'STATUSES_HISTORY', visible: true },
  { section: SECTIONS.AKO, label: 'CHARACTERISTICS.AKO', visible: Boolean(AKO_STATUSES.includes(status)) }
];

const getStatuses = (status) => {
  if (!status) {
    return [];
  }

  if (AKO_STATUSES.includes(status)) {
    return AKO_STATUSES;
  }

  if (ALLOWED_STATUSES.includes(status)) {
    return ALLOWED_STATUSES;
  }
};

const selectActions = (actions = [], activeSection) => {
  return actions.filter(
    (action) =>
      Boolean(ACTIONS_MAP[action]) &&
      (ACTIONS_MAP[action].visibleForSection === activeSection || !ACTIONS_MAP[action].visibleForSection)
  );
};

export const DisputesEntityDko = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalState, setModalState] = useState({
    text: '',
    action: ''
  });

  const { uid, section = SECTIONS.PROPOSE } = useParams();
  const {
    activeRoles: [{ relation_id }]
  } = useSelector(({ user }) => user);
  const { loading, uploading, error, disputeEntity } = useSelector(({ disputes }) => disputes);
  const statuses = getStatuses(disputeEntity?.status || 'NEW');
  const sections = getSections(disputeEntity?.status || 'NEW');

  const hasDecisionSend = disputeEntity?.actions?.includes(ACTION.AKO_DECISION_SEND);

  useEffect(() => {
    if (!checkPermissions('DISPUTES.DKO_ENTITY.ACCESS', DISPUTE_ALLOWED_ROLES)) {
      navigate('/');
    }

    dispatch(disputesActions.getEntityDko({ uid }))
      .unwrap()
      .catch(() => {
        navigate('/disputes');
      });
  }, [dispatch, navigate, uid, relation_id]);

  // useEffect(() => {
  //   if (disputeEntity?.data_type === DATA_TYPES.DRAFT) {
  //     navigate(`/disputes/dko/${uid}/create`);
  //   }
  // }, [navigate, uid, disputeEntity]);

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
      return dispatch(disputesActions.doActionDko({ uid, action }));
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
    await dispatch(disputesActions.doActionDko({ uid, action: modalState?.action, params }));
    handleModalCancelClick();
  };

  const handleTabChange = (_, section) => {
    navigate(`/disputes/dko/${uid}/${section}`);
  };

  const selectPageName = ({ id, description } = {}) => {
    if (id && description) {
      return t('PAGES.DISPUTE_BY_DESCRIPTION_WITH_ID', { description, id });
    } else if (id) {
      return t('PAGES.DISPUTE_DKO_WITH_ID', { id: id });
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
          {...{ ...ACTIONS_MAP[key], title: t(ACTIONS_MAP[key].title) }}
          disabled={loading}
          onClick={handleActionClick(key)}
        />
      ))}
    >
      <Statuses statuses={statuses} currentStatus={disputeEntity.status || 'NEW'} />

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

      <div className={'boxShadow'} style={{ padding: 24 }}>
        <FormDko disputeEntity={disputeEntity} />
      </div>

      {!loading && (
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          {section === SECTIONS.PROPOSE && <DisputesEntityDkoFiles data={disputeEntity?.files__dko_proposition} />}
          {section === SECTIONS.CONFLICT && <DisputesEntityDkoFiles data={disputeEntity?.files__dko_conflict} />}
          {section === SECTIONS.FILES && <DisputesEntityDkoFiles data={disputeEntity?.files__general} />}
          {section === SECTIONS.HISTORY && <DisputesEntityDkoHistory data={disputeEntity?.history} />}
          {section === SECTIONS.AKO && (
            <DisputesEntityDkoAko
              uid={disputeEntity?.uid}
              status={disputeEntity?.status}
              {...disputeEntity?.ako}
              hasDecisionSend={hasDecisionSend}
            />
          )}
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

      <TransferToAko
        open={modalState?.action === ACTION.TRANSFER_TO_AKO}
        onClose={handleModalCancelClick}
        onSubmit={handleModalAcceptClick}
      />

      <AkoReprocessing
        open={modalState?.action === ACTION.AKO_RESOLVED}
        onClose={handleModalCancelClick}
        onSubmit={(message) => handleModalAcceptClick({ message })}
      />

      <ImportModal
        open={modalState?.action === ACTION.UPLOAD || modalState?.action === ACTION.UPLOAD_AKO}
        loading={uploading}
        error={error}
        onClose={handleModalCancelClick}
        onUpload={(data) =>
          dispatch(
            disputesActions.uploadFileDko({
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
