import Badge from '@mui/material/Badge';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { checkPermissions } from '../../util/verifyRole';
import Page from '../../Components/Global/Page';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import UsersForm from './components/UsersForm';
import Table from './components/Table';
import {
  useProcessSettingsListQuery,
  useProcessSettingsUsersQuery,
  useProcessSettingsUsersUpdateMutation
} from './api';
import { defaultParams, setParams } from './slice';
import { ExcludesModal } from './components/ExcludesModal';

export const PROCESS_SETTINGS_ACCEPT_ROLES = ['АКО_Процеси', 'АКО_Користувачі'];

const ProcessSettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const params = useSelector((store) => store.processSettings.params);
  const [openDialog, setOpenDialog] = useState(false);
  const [openExludesDialog, setOpenExludesDialog] = useState(false);
  const updateMutation = useProcessSettingsUsersUpdateMutation({
    fixedCacheKey: 'process-settings-updating-users'
  });
  const { currentData } = useProcessSettingsUsersQuery();
  const { isFetching, isError } = useProcessSettingsListQuery(params);
  const IS_AKO_USERS = checkPermissions('PROCESS_SETTINGS.IS_AKO_USERS', 'АКО_Користувачі');

  useEffect(() => () => dispatch(setParams(defaultParams)), [dispatch]);

  return (
    <Page
      acceptPermisions={'PROCESS_SETTINGS.ACCESS'}
      acceptRoles={PROCESS_SETTINGS_ACCEPT_ROLES}
      pageName={t('PAGES.PROCESS_SETTINGS')}
      faqKey={'INFORMATION_BASE__PROCESS_SETTINGS'}
      backRoute={'/'}
      loading={isFetching || updateMutation[1].isLoading}
      notFoundMessage={isError && t('PROCESS_NOT_FOUND')}
      controls={
        IS_AKO_USERS && (
          <>
            <Badge
              badgeContent={currentData?.companies?.length ?? 0}
              color={'orange'}
              sx={{
                '& .MuiBadge-badge': {
                  right: 6,
                  top: 6,
                  pointerEvents: 'none'
                }
              }}
              onClick={() => setOpenExludesDialog(true)}
            >
              <CircleButton type={'list'} title={t('CONTROLS.EXCLUDED_COMPANIES')} />
            </Badge>
            <Badge
              badgeContent={currentData?.users?.length ?? 0}
              color={'orange'}
              sx={{
                '& .MuiBadge-badge': {
                  right: 6,
                  top: 6,
                  pointerEvents: 'none'
                }
              }}
              onClick={() => setOpenDialog(true)}
            >
              <CircleButton type={'settings'} title={t('CONTROLS.APPROVING_REPORT')} />
            </Badge>
          </>
        )
      }
    >
      <Table />
      {IS_AKO_USERS && (
        <>
          <UsersForm open={openDialog} setOpen={setOpenDialog} />
          <ExcludesModal open={openExludesDialog} onClose={() => setOpenExludesDialog(false)} />
        </>
      )}
    </Page>
  );
};

export default ProcessSettings;
