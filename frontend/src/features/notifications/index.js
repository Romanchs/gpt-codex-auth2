import Page from '../../Components/Global/Page';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDeleteNotificationMutation, useNotificationsQuery, useReadNotificationMutation } from './api';
import { Pagination } from '../../Components/Theme/Table/Pagination';
import { StyledTable } from '../../Components/Theme/Table/StyledTable';
import { TableBody, TableRow } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Row from './Row';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import NotResultRow from '../../Components/Theme/Table/NotResultRow';
import { useDispatch, useSelector } from 'react-redux';
import { setSelected, toggleFilter } from './slice';
import NotificationDialog from './NotificationDialog';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import Filter from './Filter';
import Badge from '@mui/material/Badge';
import StickyTableHead from '../../Components/Theme/Table/StickyTableHead';

const Notifications = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selected = useSelector((store) => store.notifications.selected);
  const [params, setParams] = useState({ page: 1, size: 50 });
  const { data, isFetching, refetch } = useNotificationsQuery(params);
  const [onDelete, { isLoading }] = useDeleteNotificationMutation({ fixedCacheKey: 'delete-notifications' });
  const [onRead, { isLoading: isReading }] = useReadNotificationMutation();
  const list = data?.data || [];
  const hasUnread = Boolean(selected.map((s) => list.find((i) => i.id === s)).find((i) => !i.read));

  const handleSelect = () => {
    dispatch(setSelected(selected.length === list.length ? [] : list.map((i) => i.id)));
  };

  const handleView = () => {
    onRead(selected);
  };

  const handleDelete = () => {
    onDelete(selected);
  };

  return (
    <Page
      pageName={t('NOTIFICATIONS.NOTIFICATIONS')}
      backRoute={() => navigate(-1)}
      loading={isFetching || isLoading || isReading}
      controls={
        <>
          {selected.length > 0 && hasUnread && (
            <CircleButton type={'details'} title={t('CONTROLS.MARK_AS_READ')} onClick={handleView} />
          )}
          {selected.length > 0 && !hasUnread && (
            <CircleButton type={'delete'} title={t('CONTROLS.DELETE_SELECTED')} onClick={handleDelete} />
          )}
          <CircleButton
            onClick={() => dispatch(toggleFilter())}
            title={t('NOTIFICATIONS.NOTIFICATION_SETTINGS')}
            icon={
              <Badge
                badgeContent={Object.values(params).filter(Boolean).length - 2}
                color={'orange'}
                sx={{
                  '& .MuiBadge-badge': {
                    right: -6,
                    top: -6
                  }
                }}
              >
                <FilterListRoundedIcon />
              </Badge>
            }
            color={'white'}
            dataMarker={'notification_settings'}
          />
          <CircleButton
            type={'autorenew'}
            title={t('CONTROLS.UPDATE')}
            onClick={() => {
              refetch();
              dispatch(setSelected([]));
            }}
          />
        </>
      }
    >
      <Filter
        onChange={(p) => {
          setParams({ ...params, ...p, page: 1 });
          dispatch(setSelected([]));
        }}
      />
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            <TableCell className={'MuiTableCell-head'} align={'center'} width={50} data-marker={'checkbox_cell'}>
              {/*<p>{t('ALL')}</p>*/}
              <Checkbox
                sx={{ p: 0 }}
                icon={<RadioButtonUncheckedIcon sx={{ fill: '#fff' }} />}
                checkedIcon={<TaskAltRoundedIcon color={'orange'} />}
                checked={list.length > 0 && list.length === selected.length}
                onChange={handleSelect}
                data-marker={'checkbox_all'}
                data-status={list.length > 0 && list.length === selected.length ? 'active' : 'inactive'}
              />
            </TableCell>
            <TableCell className={'MuiTableCell-head'} />
            <TableCell className={'MuiTableCell-head'} width={150} />
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {list.length > 0 ? (
            list.map((i) => <Row key={i.id} notification={i} />)
          ) : (
            <NotResultRow text={t('NOTIFICATIONS.NO_NOTIFICATIONS')} span={3} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        {...data}
        params={params}
        loading={isFetching}
        onPaginate={(p) => {
          setParams({ ...params, ...p });
          dispatch(setSelected([]));
        }}
        sizeSteps={[50, 100]}
      />
      <NotificationDialog />
    </Page>
  );
};

export default Notifications;
