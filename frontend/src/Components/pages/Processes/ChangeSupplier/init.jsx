import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Page from '../../../Global/Page';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import { useEffect, useState } from 'react';
import { checkPermissions } from '../../../../util/verifyRole';
import Statuses from '../../../Theme/Components/Statuses';
import Grid from '@material-ui/core/Grid';
import StyledInput from '../../../Theme/Fields/StyledInput';
import DatePicker from '../../../Theme/Fields/DatePicker';
import moment from 'moment';
import { changeSupplierStart } from '../../../../actions/processesActions';
import Toggle from '../../../Theme/Fields/Toggle';
import Box from '@material-ui/core/Box';
import SelectField from '../../../Theme/Fields/SelectField';
import { TYPE_OF_ACCOUNTING_POINT } from '../../../../util/directories';
import { useTranslation } from 'react-i18next';

const InitChangeSupplier = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    activeOrganization,
    activeRoles: [{ relation_id }],
    full_name
  } = useSelector(({ user }) => user);
  const { loading } = useSelector(({ processes }) => processes);
  const [data, setData] = useState({
    must_be_finished_at: null,
    from_pon: false,
    type_of_ap: ''
  });

  // Check roles & get data
  useEffect(() => {
    if (!checkPermissions('PROCESSES.CHANGE_SUPPLIER.INITIALIZATION', 'СВБ')) {
      navigate('/processes');
    }
  }, [navigate, relation_id]);

  const handleStart = () => {
    dispatch(
      changeSupplierStart(
        {
          ...data,
          must_be_finished_at: moment.utc(data.must_be_finished_at).format('yyyy-MM-DDTHH:mm:ss+00:00')
        },
        (uid) => navigate(`/processes/change-supplier/${uid}`)
      )
    );
  };

  return (
    <Page
      pageName={t('PAGES.CHANGE_SUPPLIER')}
      backRoute={'/processes'}
      loading={loading}
      controls={
        <CircleButton
          type={'create'}
          title={t('CONTROLS.TAKE_TO_WORK')}
          onClick={handleStart}
          disabled={
            !data.must_be_finished_at ||
            !data.type_of_ap ||
            !moment(data.must_be_finished_at).isValid() ||
            moment(data.must_be_finished_at)?.startOf('day')?.unix() <
              moment()
                .subtract(data.from_pon ? 1 : 5, 'month')
                ?.startOf('month')
                ?.unix()
          }
        />
      }
    >
      <Statuses statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'CANCELED']} currentStatus={'NEW'} />
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.USER_INITIATOR')} disabled value={full_name} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.EIC_X_INITIATOR')} disabled value={activeOrganization?.eic} />
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledInput label={t('FIELDS.INITIATOR_COMPANY')} disabled value={activeOrganization?.name} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.USREOU')} disabled value={activeOrganization?.usreou} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DatePicker
              label={t('FIELDS.CHANGED_SUPPLIER_AT')}
              value={data.must_be_finished_at}
              onChange={(must_be_finished_at) => setData({ ...data, must_be_finished_at })}
              minDate={moment()
                .startOf('month')
                .subtract(data.from_pon ? 1 : 5, 'month')}
              // error={error?.must_be_finished_at}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <SelectField
              onChange={(type_of_ap) => setData({ ...data, type_of_ap })}
              value={data.type_of_ap}
              label={t('FIELDS.POINT_TYPE')}
              data={Object.keys(TYPE_OF_ACCOUNTING_POINT).map((key) => ({
                value: key,
                label: t(TYPE_OF_ACCOUNTING_POINT[key]),
                disabled: key === 'Exchange'
              }))}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Box style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
              <Toggle
                title={data.from_pon ? t('FIELDS.CHANGES_FROM_PON') : t('FIELDS.CHANGES_NOT_FROM_PON')}
                color={'green-red'}
                dataMarker={'checkTypeToggle'}
                setSelected={(from_pon) => setData({ ...data, from_pon })}
                selected={data.from_pon}
              />
              <span
                data-marker={'uploadTypesText'}
                style={{ fontWeight: 500, color: '#567691', cursor: 'pointer' }}
                onClick={() => setData({ ...data, from_pon: !data.from_pon })}
              >
                {t('FIELDS.CHANGES_FROM_PON')}
              </span>
            </Box>
          </Grid>
        </Grid>
      </div>
    </Page>
  );
};

export default InitChangeSupplier;
