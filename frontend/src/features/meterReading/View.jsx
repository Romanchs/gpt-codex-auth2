import Page from '../../Components/Global/Page';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import React, { useState } from 'react';
import { useMeterDataExportMutation, useMeterDataQuery } from './api';
import { Pagination } from '../../Components/Theme/Table/Pagination';
import { useNavigate } from 'react-router-dom';
import ViewTable from './components/ViewTable';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { checkPermissions } from '../../util/verifyRole';
import useExportFileLog from '../../services/actionsLog/useEportFileLog';
import useViewCallbackLog from '../../services/actionsLog/useViewCallbackLog';
import { METER_READING_LOG_TAGS } from '../../services/actionsLog/constants';

export const METER_READING_ACCEPT_ROLES = [
  'СВБ',
  'АКО_Процеси',
  'АКО_ППКО',
  'АКО_Суперечки',
  'АТКО',
  'ОЗД',
  'ОДКО',
  'АДКО',
  'ОЗКО',
  'СВБ'
];

const View = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params, setParams] = useState({ page: 1, size: 25 });
  const selected = useSelector((store) => store.meterReading.selected);
  const [exportSelected, { isLoading }] = useMeterDataExportMutation();
  const exportFileLog = useExportFileLog(METER_READING_LOG_TAGS);
  const onPaginateLog = useViewCallbackLog();

  const isFiltersEmpty = checkPermissions('METER_READING.VIEW_DATA.FUNCTIONS.FILTERS', ['СВБ']) && !params.period_from && !params.period_to;
  const { data, isFetching } = useMeterDataQuery(params, {skip: isFiltersEmpty});

  const handleDownload = () => {
    exportSelected({ body: { uids: selected }, name: t('PAGES.VIEW_METER_READINGS') + '.zip' });
    exportFileLog();
  };

  const onPaginate = (p) => {
    setParams({ ...params, ...p });
    onPaginateLog();
  };

  return (
    <Page
      pageName={t('PAGES.VIEW_METER_READINGS')}
      backRoute={'/'}
      faqKey={'INFORMATION_BASE__METER_READING'}
      loading={isFetching || isLoading}
      acceptPermisions={'METER_READING.ACCESS'}
      acceptRoles={METER_READING_ACCEPT_ROLES}
      controls={
        <>
          {selected.length > 0 && (
            <CircleButton type={'download'} title={t('CONTROLS.DOWNLOAD_SHOWS')} onClick={handleDownload} />
          )}
          {checkPermissions('METER_READING.SEND_DATA.ACCESS', ['ОЗД', 'АКО_Процеси']) && (
            <CircleButton
              type={'document'}
              title={t('CONTROLS.UPLOAD_METER_READING')}
              onClick={() => navigate('/meter-reading/uploads')}
            />
          )}
        </>
      }
    >
      <ViewTable data={data} setParams={setParams} params={params} />
      <Pagination {...data} loading={isFetching} params={params} onPaginate={onPaginate} />
    </Page>
  );
};

export default View;
