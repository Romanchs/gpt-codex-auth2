import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import { useExportApGenQuery } from './api';
import { UploadedFilesTable } from '../../../Components/pages/Processes/Components/UploadedFilesTable';
import DelegateInput from '../../delegate/delegateInput';
import { useTranslation } from 'react-i18next';
import { useLazyMsFilesDownloadQuery } from '../../../app/mainApi';
import useExportFileLog from '../../../services/actionsLog/useEportFileLog';

const DetailsTab = () => {
  const {t} = useTranslation();
  const { uid } = useParams();
  const { usreou, eic, name } = useSelector((store) => store.user.organizations.find((i) => i.active));
  const userName = useSelector((store) => store.user.full_name);
  const { currentData: data, refetch } = useExportApGenQuery({ uid, tab: 'files' }, { skip: !uid });
  const [download] = useLazyMsFilesDownloadQuery();
  const exportFileLog = useExportFileLog(['Формування витягу за генеруючими установками споживача']);


  const handleDownload = ({ file_processed_id, file_name }) => {
    download({ id: file_processed_id, name: file_name });
    exportFileLog(uid);
  };

  return (
    <>
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6}>
            <DelegateInput
              label={t('FIELDS.USER_INITIATOR')}
              value={data?.initiator?.username ?? userName ?? ''}
              readOnly
              data={data?.delegation_history || []}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.FORMED_AT')}
              readOnly
              value={data?.created_at ? moment(data.created_at).format('DD.MM.yyyy • HH:mm') : ''}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.IDENTIFIER')} readOnly value={data?.initiator_company?.usreou ?? usreou ?? ''} />
          </Grid>
          <Grid item xs={12} md={9}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY')}
              readOnly
              value={data?.initiator_company?.short_name || name || ''}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.EIC')} readOnly value={data?.initiator_company?.eic ?? eic ?? ''} />
          </Grid>
        </Grid>
      </div>
      {uid && (
        <>
          <h3
            style={{
              fontSize: 15,
              fontWeight: 'normal',
              color: '#0D244D',
              lineHeight: 1.2,
              paddingBottom: 16,
              paddingTop: 18
            }}
          >
            {t('DOWNLOADED_FILES')}:
          </h3>
          <UploadedFilesTable
            files={data?.files?.data ?? []}
            handleDownload={handleDownload}
            handleUpdateList={refetch}
          />
        </>
      )}
    </>
  );
};

export default DetailsTab;
