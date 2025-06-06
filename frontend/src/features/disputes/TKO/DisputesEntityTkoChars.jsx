import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { noop } from 'lodash';

import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import { PropsRow } from '../components/PropsRow/PropsRow';
import { ACTION, AKO_STATUSES, DATA_TYPES, DISPUTE_STATUSES } from '../constants';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';

const columns = (status) => [
  {
    id: 'property',
    title: 'FIELDS.CONTROVERSIAL_CHARACTERISTIC',
    minWidth: 130,
    cols: 3
  },
  {
    id: 'current',
    title: 'FIELDS.CURRENT_VALUE',
    minWidth: 130,
    cols: 3
  },
  {
    id: 'by_initiator',
    title: 'FIELDS.PROPOSED_BY_INITIATOR',
    minWidth: 130,
    cols: 3
  },
  {
    id: 'by_executor',
    title: 'FIELDS.PROPOSED_BY_EXECUTOR',
    minWidth: 130,
    cols: 2
  },
  {
    id: 'by_ako',
    title: 'FIELDS.PROPOSED_BY_AKO',
    minWidth: 130,
    cols: 2,
    visible: Boolean(AKO_STATUSES.includes(status))
  }
];

export const DisputesEntityTkoChars = ({ disputeEntity = {}, onEdit = noop, onApply = noop }) => {
  const { t } = useTranslation();
  const isEditable = disputeEntity?.actions?.includes(ACTION.EDIT_PROPERTY);
  const hasActions = [
    DISPUTE_STATUSES.NEW,
    DISPUTE_STATUSES.IN_PROCESS,
    DISPUTE_STATUSES.REPROCESSING,
    DISPUTE_STATUSES.PROCESSED,
    DISPUTE_STATUSES.NEW,
    DISPUTE_STATUSES.AKO_IN_PROCESS
  ].includes(disputeEntity.status);

  const handleEditClick = (property) => () => {
    onEdit(property);
  };

  const handleApplyClick = (property) => () => {
    onApply(property);
  };

  return (
    <>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {columns(disputeEntity.status)
              .filter(({ visible = true }) => visible)
              .map(({ id, title, minWidth, cols }) => (
                <TableCell key={id} style={{ minWidth }} colSpan={cols} className={'MuiTableCell-head'}>
                  {t(title)}
                </TableCell>
              ))}

            <TableCell style={{ width: 80 }} className={'MuiTableCell-head'}></TableCell>
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {!disputeEntity?.properties?.length && (
            <NotResultRow span={12} text={t('NO_CONFLICTING_CHARACTERISTICS_FOUND')} small />
          )}
          {disputeEntity?.properties?.map((property) => (
            <PropsRow
              {...property}
              key={property.property_code}
              status={disputeEntity.status}
              actions={hasActions}
              editable={isEditable}
              handleEditClick={handleEditClick(property)}
              handleApplyClick={
                disputeEntity.data_type === DATA_TYPES.FORMED_AKO && !property.by_executor
                  ? null
                  : handleApplyClick(property)
              }
            />
          ))}
        </TableBody>
      </StyledTable>
    </>
  );
};
