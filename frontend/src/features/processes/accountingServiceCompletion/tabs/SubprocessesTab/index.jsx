import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetSubProcessesQuery } from '../../api';
import CircleButton from '../../../../../Components/Theme/Buttons/CircleButton';
import { REQUESTS_LINKS } from './constants';
import InnerDataTable from '../../../changePPKO/InnerDataTable';
import moment from 'moment/moment';
import { Pagination } from '../../../../../Components/Theme/Table/Pagination';
import { Box } from '@mui/material';

const SubprocessesTab = ({ setIsLoading }) => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params, setParams] = useState({ page: 1, size: 25 });
  const { currentData, isFetching } = useGetSubProcessesQuery({ uid, params }, { skip: !uid });

  useEffect(() => {
    setIsLoading(isFetching);
  }, [isFetching]);

  const columns = [
    { id: 'id', label: 'FIELDS.SUBPROCESS_ID', minWidth: 150 },
    {
      id: 'name',
      label: 'FIELDS.SUBPROCESS_NAME',
      minWidth: 150,
      renderBody: (name, _, t) => t(REQUESTS_LINKS[name]?.text)
    },
    {
      id: 'is_finished',
      label: 'FIELDS.DONE',
      minWidth: 150,
      renderBody: (is_finished) => (
        <Box sx={doneChipSx(is_finished)}>{is_finished ? t('CONTROLS.YES') : t('CONTROLS.NO')}</Box>
      )
    },
    {
      id: 'created_at',
      label: 'FIELDS.INITIALIZATION_DATE',
      minWidth: 150,
      renderBody: (date) => date && moment(date).format('DD.MM.yyyy • HH:mm')
    },
    {
      id: 'must_be_finished_at',
      label: 'FIELDS.DONE_DATETIME',
      minWidth: 150,
      renderBody: (date) => date && moment(date).format('DD.MM.yyyy • HH:mm')
    },
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
            title={t('FIELDS.LINK_TO', { name: t(REQUESTS_LINKS[args[1].name]?.text) })}
            onClick={() => navigate(REQUESTS_LINKS[args[1].name]?.link?.replace('{uid}', args[1]?.uid))}
          />
        )
    }
  ];

  const renderRow = (row, index) => (
    <TableRow key={row?.id} data-marker={'table-row'} className={'body__table-row'} tabIndex={index}>
      {columns.map(({ id, align, renderBody }, i) => (
        <TableCell key={id + i} data-marker={id} align={align || 'left'}>
          {renderBody ? renderBody(row[id], row, t) : row[id]}
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <>
      <InnerDataTable
        columns={columns}
        currentData={currentData?.subprocesses}
        loading={isFetching}
        BodyRow={renderRow}
        isPagination={false}
        ignoreI18={false}
      />
      <Pagination
        {...currentData?.subprocesses}
        loading={isFetching}
        params={params}
        onPaginate={(p) => setParams({ ...params, ...p })}
      />
    </>
  );
};

export default SubprocessesTab;

const doneChipSx = (isFinished) => ({
  color: isFinished ? '#018C0D' : '#FF0000',
  backgroundColor: '#D1EDF37D',
  borderRadius: 6,
  width: 56,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 12,
  fontWeight: 400
});
