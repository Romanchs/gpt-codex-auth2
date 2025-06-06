import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { downloadDetailsTKO, getTkoById, setTkoParams } from '../../../actions/tkoActions';
import { checkPermissions, verifyRole } from '../../../util/verifyRole';
import Page from '../../Global/Page';
import CircleButton from '../../Theme/Buttons/CircleButton';
import { disputesActions } from '../../../features/disputes/disputes.slice';
import { CreateDispute, DisputeActions } from './TkoDispute';
import { DHTab, DHTabs } from '../Processes/Components/Tabs';
import ListTab from './ListTab';
import { useTranslation } from 'react-i18next';
import useViewDataLog from '../../../services/actionsLog/useViewDataLog';
import SelectTimelineType from '../../../features/tko/SelectTimelineType';
import VirtualTkoAccordion from './VirtualTkoAccordion';
import { IS_PROD } from '../../../util/getEnv';

const tabs = {
  list: 'list',
  timeline: 'timeline',
  virtualTKO: 'virtualTKO'
};

const Tko = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { selectedTko, error, loading } = useSelector((store) => store.tko);
  const { activeRoles } = useSelector((store) => store.user);
  const { visibleCreate, selectedTypes } = useSelector((store) => store.disputes);
  let { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState(tabs.list);
  const viewDataLog = useViewDataLog(['Реєстр ТКО'], 'ap', id);
  useEffect(() => {
    setTab(tabs.list);
  }, [selectedTko]);

  useEffect(() => {
    if (error) {
      dispatch(setTkoParams({ page: 1, size: 25, point_type: 'installation_ap' }));
      navigate('/');
    } else {
      dispatch(getTkoById(id, location.state?.subprocess_uid));
      viewDataLog();
    }
  }, [id, dispatch, navigate, activeRoles, error, location.state?.subprocess_uid]);

  useEffect(() => {
    return () => {
      dispatch(disputesActions.setVisibleCreate(false));
    };
  }, [dispatch]);

  const handleCreateDispute = () => {
    dispatch(
      disputesActions.create({
        eic: selectedTko?.EIC,
        properties: selectedTypes
      })
    )
      .unwrap()
      .then(({ uid }) => navigate(`/disputes/tko/${uid}/create`));
  };

  const handleChangeTab = (_, newValue) => {
    setTab(newValue);
  };

  return (
    <Page
      pageName={
        selectedTko?.CmoCorrespondParentType && !loading
          ? `${t('FIELDS.TKO_DETAIL')} (${t('PLATFORM.' + selectedTko?.CmoCorrespondParentType.toUpperCase())})`
          : t('FIELDS.TKO_DETAIL')
      }
      backRoute={'/tko'}
      loading={loading}
      faqKey={'INFORMATION_BASE__TKO_DETAIL'}
      acceptPermisions={'TKO.TKO_DETAIL.ACCESS'}
      rejectRoles={['АР (перегляд розширено)', 'АР', 'Адміністратор АР', 'АКО/АР_ZV', 'Третя сторона']}
      controls={
        <>
          {location.state?.subprocess_uid && selectedTko?.UID && (
            <CircleButton
              icon={<VisibilityRounded />}
              color={'blue'}
              title={t('PAGES.GTS_DKO')}
              dataMarker={'dko-view'}
              onClick={() =>
                navigate(`/gts/z/${selectedTko?.UID}`, {
                  state: { from: location, subprocess_uid: location.state.subprocess_uid }
                })
              }
            />
          )}

          {!location.state?.subprocess_uid &&
            !selectedTko?.CmoCorrespondParentType &&
            checkPermissions('TKO.TKO_DETAIL.CONTROLS.INIT_DISPUTE', ['СВБ', 'АКО_Суперечки', 'АТКО']) && (
              <DisputeActions
                showDisputes={visibleCreate}
                onDispute={() => dispatch(disputesActions.setVisibleCreate(true))}
                onCancelDispute={() => dispatch(disputesActions.setVisibleCreate(false))}
                disabledCreate={Boolean(!selectedTypes?.length)}
                onCreateDispute={handleCreateDispute}
              />
            )}

          {!visibleCreate &&
            !location.state?.subprocess_uid &&
            tab === tabs.list &&
            !selectedTko?.CmoCorrespondParentType &&
            checkPermissions('TKO.TKO_DETAIL.CONTROLS.DOWNLOAD_TKO', ['СВБ', 'АТКО', 'АКО_Процеси']) && (
              <CircleButton
                type={'download'}
                title={t('CONTROLS.CREATE_AN_EXTRACT')}
                dataMarker={'tko-download'}
                onClick={() => dispatch(downloadDetailsTKO(id, selectedTko?.EIC))}
              />
            )}
        </>
      }
    >
      {checkPermissions('TKO.TKO_DETAIL.CONTROLS.INIT_DISPUTE', ['СВБ', 'АКО_Суперечки', 'АТКО']) && visibleCreate && (
        <CreateDispute />
      )}
      <div className={'boxShadow'} style={{ paddingLeft: 24, paddingRight: 24, marginTop: 16, marginBottom: 16 }}>
        <DHTabs value={tab || tabs.list} onChange={handleChangeTab}>
          <DHTab label={t('CONTROLS.LIST')} value={tabs.list} />
          {!selectedTko?.CmoCorrespondParentType &&
            (!IS_PROD || verifyRole(['АКО', 'АКО_Процеси', 'АТКО', 'СВБ', 'ОДКО', 'ОМ'])) && (
              <DHTab label={t('CONTROLS.TIMELINE')} value={tabs.timeline} />
            )}
          {!selectedTko?.CmoCorrespondParentType &&
            selectedTko?.ChildAps &&
            Object.keys(selectedTko?.ChildAps).length && (
              <DHTab label={t('CONTROLS.RELATED_TKO')} value={tabs.virtualTKO} />
            )}
        </DHTabs>
      </div>
      {tab === tabs.list && <ListTab selectedTko={selectedTko} />}
      {tab === tabs.timeline && <SelectTimelineType />}
      {tab === tabs.virtualTKO && <VirtualTkoAccordion selectedTko={selectedTko} />}
    </Page>
  );
};

export default Tko;
