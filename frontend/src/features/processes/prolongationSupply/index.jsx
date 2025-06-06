import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { useInitProlongationSupplyMutation } from './api';
import Page from '../../../Components/Global/Page';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import Statuses from '../../../Components/Theme/Components/Statuses';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import { useTranslation } from 'react-i18next';

const InitProlongationSupply = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { full_name, activeOrganization } = useSelector(({ user }) => user);
  const [init, { isLoading }] = useInitProlongationSupplyMutation();

  const handleInit = () => {
    init().then(({ data }) => navigate(`/processes/prolongation-supply/${data}`));
  };

  return (
    <Page
      pageName={t('PAGES.EXTENDING_TERM_OF_SUPPLY_CONTRACT')}
      backRoute={'/processes'}
      loading={isLoading}
      acceptPermisions={'PROCESSES.PROLONGATION_SUPPLY.INITIALIZATION'}
      acceptRoles={['СВБ']}
      controls={
        <CircleButton type={'create'} title={t('CONTROLS.TAKE_TO_WORK')} onClick={handleInit} disabled={isLoading} />
      }
    >
      <Statuses statuses={['NEW', 'IN_PROCESS', 'DONE', 'PARTIALLY_DONE', 'CANCELED']} currentStatus={'NEW'} />
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.USER_INITIATOR')} disabled value={full_name} />
          </Grid>
          <Grid item xs={12} md={6} lg={9}>
            <StyledInput label={t('FIELDS.INITIATOR_COMPANY')} disabled value={activeOrganization?.name} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.CREATED_AT')} disabled value={moment().format('DD.MM.yyyy • HH:mm')} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.COMPLETE_DATETIME')} disabled value={null} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.UNIQUE_APS')} disabled value={null} />
          </Grid>
        </Grid>
      </div>
    </Page>
  );
};

export default InitProlongationSupply;
