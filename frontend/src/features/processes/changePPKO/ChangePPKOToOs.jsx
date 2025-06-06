import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import Page from '../../../Components/Global/Page';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import Statuses from '../../../Components/Theme/Components/Statuses';
import RadioList from '../../../Components/Theme/Fields/RadioList';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import { DHTab, DHTabs } from '../../../Components/pages/Processes/Components/Tabs';
import { DEFAULT_ROLES, SUBPROCESSES_LINKS } from './data';
import { useChangePPKOToOsQuery, useSubprocessesChangePPKOToOsQuery } from './api';
import InnerDataTable from './InnerDataTable';
import { useTranslation } from 'react-i18next';

const defaultParams = { page: 1, size: 25 };

const detailsColumns = [
  { id: 'eic', label: 'FIELDS.AP_CODE_TYPE_Z', minWidth: 200 },
  { id: 'connection_status', label: 'FIELDS.CONNECTION_STATUS', minWidth: 200 },
  { id: 'customer', label: 'FIELDS.AP_CUSTOMER_CODE', minWidth: 200 },
  { id: 'city', label: 'FIELDS.CITY', minWidth: 200 }
];

const subprocessesColumns = [
  { id: 'id', label: 'FIELDS.SUBPROCESS_ID', minWidth: 150 },
  {
    id: 'name',
    label: 'FIELDS.SUBPROCESS_NAME',
    minWidth: 150,
    renderBody: (name, _, t) => t(SUBPROCESSES_LINKS[name]?.text)
  },
  // {id: 'is_finished', label: 'Виконано', minWidth: 150, renderBody: is_finished => is_finished ? 'Так' : 'Ні'},
  {
    id: 'created_at',
    label: 'FIELDS.INITIALIZATION_DATE',
    minWidth: 150,
    renderBody: (created_at) => created_at && moment(created_at).format('DD.MM.yyyy • HH:mm')
  },
  {
    id: 'must_be_finished_at',
    label: 'FIELDS.DEADLINE',
    minWidth: 150,
    renderBody: (must_be_finished_at) => must_be_finished_at && moment(must_be_finished_at).format('DD.MM.yyyy • HH:mm')
  }
  /*{
		id: 'finished_at',
		label: 'Дата та час виконання',
		minWidth: 150,
		renderBody: finished_at => finished_at && moment(finished_at).format('DD.MM.yyyy • HH:mm')
	}*/
];

const ChangePPKOToOs = () => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState('details');
  const [params, setParams] = useState(defaultParams);

  const { data, isFetching, isError } = useChangePPKOToOsQuery({ uid, params }, { skip: tab !== 'details' });

  const columns =
    tab === 'details'
      ? detailsColumns
      : [
          ...subprocessesColumns,
          {
            id: 'link',
            label: 'FIELDS.LINK',
            minWidth: 100,
            align: 'center',
            renderBody: (...args) =>
              args[1]?.uid && (
                <CircleButton
                  type={'link'}
                  size={'small'}
                  title={t('FIELDS.LINK_TO', { name: t(SUBPROCESSES_LINKS[args[1].name]?.text) })}
                  onClick={() => navigate(SUBPROCESSES_LINKS[args[1].name]?.link?.replace('{uid}', args[1]?.uid))}
                />
              )
          }
        ];
  const selectedList = data?.additional_data?.roles_info
    ? Object.entries(data?.additional_data?.roles_info)
        .filter((i) => i[1])
        .map((i) => i[0])
    : [];

  const { data: subprocesses, isFetching: isLoadingSubprocesses } = useSubprocessesChangePPKOToOsQuery(uid, {
    skip: tab !== 'requests'
  });

  const handleChangeTab = (...args) => {
    setTab(args[1]);
    if (args[1] === 'details') {
      setParams(defaultParams);
    }
  };

  return (
    <Page
      acceptPermisions={'PROCESSES.CHANGE_PPKO.TO_OS.ACCESS'}
      acceptRoles={['АКО_ППКО']}
      pageName={data?.id ? t('PAGES.CHANGE_PPKO_TO_OS', { id: data?.id }) : `${t('LOADING')}...`}
      backRoute={'/processes'}
      loading={isFetching || isLoadingSubprocesses}
      notFoundMessage={isError && t('PROCESS_NOT_FOUND')}
    >
      <Statuses statuses={['FORMED', 'DONE', 'CANCELED']} currentStatus={data?.status} />
      <Box className={'boxShadow'} sx={{ pl: 3, pr: 3, mt: 2, mb: 2 }}>
        <DHTabs value={tab} onChange={handleChangeTab}>
          <DHTab label={t('REQUEST_DETAILS')} value={'details'} />
          {uid && <DHTab label={t('INITIATED_SUBPROCESSES')} value={'requests'} />}
        </DHTabs>
      </Box>
      {tab === 'details' && (
        <>
          <Box className={'boxShadow'} sx={{ mt: 2, mb: 2 }}>
            <Box
              component={'h3'}
              sx={{
                fontSize: 15,
                fontWeight: 'normal',
                color: '#0D244D',
                lineHeight: 1.2,
                padding: '16px 24px'
              }}
            >
              {t('ROLES_FOR_PPKO_CHANGES')}
            </Box>
            <Box
              component={'hr'}
              sx={{
                height: '1px',
                border: 'none',
                backgroundColor: '#FFFFFF',
                boxShadow: 'inset 0px -1px 0px #E9EDF6'
              }}
            />
            <RadioList data={Object.entries(DEFAULT_ROLES)} selected={selectedList} groupName={'roles'} />
          </Box>
          <Box className={'boxShadow'} sx={{ p: 3, mt: 2, mb: 2 }}>
            <Grid container spacing={3} alignItems={'flex-start'}>
              <Grid item xs={12} md={6}>
                <StyledInput
                  label={t('FIELDS.SHORT_PPKO_NAME')}
                  value={data?.additional_data?.ppko_company?.short_name}
                  readOnly
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <StyledInput
                  label={t('FIELDS.EIC_CODE_PPKO')}
                  value={data?.additional_data?.ppko_company?.eic}
                  readOnly
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <StyledInput label={t('FIELDS.USREOU')} value={data?.additional_data?.ppko_company?.usreou} readOnly />
              </Grid>
              <Grid item xs={12} md={2}>
                <StyledInput
                  label={t('FIELDS.CHANGE_PPKO_DATE')}
                  value={data?.must_be_finished_at && moment(data?.must_be_finished_at).format('DD.MM.yyyy')}
                  readOnly
                />
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <StyledInput
                  label={data?.status?.startsWith('CANCELED') ? t('FIELDS.CANCELED_AT') : t('FIELDS.COMPLETE_DATETIME')}
                  value={data?.finished_at && moment(data?.finished_at).format('DD.MM.yyyy • HH:mm')}
                  readOnly
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <StyledInput
                  label={t('FIELDS.COMPLETED_AT')}
                  value={data?.completed_at && moment(data?.completed_at).format('DD.MM.yyyy • HH:mm')}
                  readOnly
                />
              </Grid>
            </Grid>
          </Box>
          <Box className={'boxShadow'} sx={{ p: 3, mt: 2, mb: 2 }}>
            <Grid container spacing={3} alignItems={'flex-start'}>
              <Grid item xs={12} md={6}>
                <StyledInput label={t('FIELDS.USER_INITIATOR')} value={'Системний користувач Датахаб'} readOnly />
              </Grid>
              <Grid item xs={12} md={3}>
                <StyledInput
                  label={t('FIELDS.CREATED_AT')}
                  value={data?.created_at && moment(data?.created_at).format('DD.MM.yyyy • HH:mm')}
                  readOnly
                />
              </Grid>
              <Grid item xs={12}>
                <StyledInput
                  label={t('FIELDS.INITIATOR_COMPANY')}
                  value={data?.initiator_company?.full_name}
                  readOnly
                />
              </Grid>
            </Grid>
          </Box>
          <InnerDataTable
            columns={columns}
            currentData={data?.aps}
            loading={isFetching}
            params={params}
            setParams={setParams}
            ignoreI18={false}
          />
        </>
      )}
      {tab === 'requests' && (
        <InnerDataTable
          columns={columns}
          currentData={subprocesses?.subprocesses}
          loading={isLoadingSubprocesses}
          params={params}
          setParams={setParams}
          ignoreI18={false}
        />
      )}
    </Page>
  );
};

export default ChangePPKOToOs;
