import React, { useEffect } from 'react';
import Page from '../../../Global/Page';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import Statuses from '../../../Theme/Components/Statuses';
import Grid from '@material-ui/core/Grid';
import StyledInput from '../../../Theme/Fields/StyledInput';
import { useDispatch, useSelector } from 'react-redux';
import { checkPermissions } from '../../../../util/verifyRole';
import { initGrantingAuthorityTKO } from '../../../../actions/processesActions';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IS_PROD } from '../../../../util/getEnv';

const InitGrantingAuthority = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    activeOrganization,
    activeRoles: [{ relation_id }],
    full_name
  } = useSelector(({ user }) => user);

  // Check roles & get data
  useEffect(() => {
    if (!checkPermissions('PROCESSES.GRANTING_AUTHORITY.INITIALIZATION', IS_PROD ? ['СВБ'] : ['СВБ', 'АТКО', 'ОДКО', 'ОЗД', 'ОЗКО'])) {
      navigate('/processes');
    }
  }, [dispatch, navigate, relation_id, uid]);

  const handleStart = () => {
    dispatch(initGrantingAuthorityTKO((uid) => navigate(`/processes/granting-authority/${uid}`)));
  };

  return (
    <Page
      pageName={t('PAGES.GRANTING_AUTHORITY')}
      backRoute={'/processes'}
      controls={<CircleButton type={'create'} title={'Взяти в роботу'} onClick={handleStart} />}
    >
      <Statuses statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'CANCELED']} currentStatus={'NEW'} />
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.USER_INITIATOR')} disabled value={full_name} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.EIC_CODE_TYPE_X_OF_COMPANY')} disabled value={activeOrganization?.eic} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.USREOU')} disabled value={activeOrganization?.usreou} />
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledInput label={t('FIELDS.INITIATOR_COMPANY')} disabled value={activeOrganization?.name} />
          </Grid>
        </Grid>
      </div>
    </Page>
  );
};

export default InitGrantingAuthority;
