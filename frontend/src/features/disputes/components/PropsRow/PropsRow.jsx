import TableCell from '@material-ui/core/TableCell/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { noop } from 'lodash';

import CircleButton from '../../../../Components/Theme/Buttons/CircleButton';
import { AKO_STATUSES } from '../../constants';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

const datesCodes = ['202-3', '206-9', '206-19', '104-52'];

export const PropsRow = ({
  status,
  property = '',
  property_code = '',
  current = '',
  by_initiator = '',
  by_executor = '',
  by_ako = '',
  editable = false,
  actions = true,
  handleEditClick = noop,
  handleApplyClick = noop
}) => {
  const { t } = useTranslation();
  return (
    <>
      <TableRow data-marker="table-row" className="body__table-row">
        <TableCell data-marker={'property'} colSpan={3}>
          {property || '-'}
        </TableCell>
        <TableCell data-marker={'current'} colSpan={3}>
          {datesCodes.includes(property_code) && moment(current).isValid()
            ? moment(current).format('DD.MM.YYYY')
            : current || '-'}
        </TableCell>
        <TableCell data-marker={'by_initiator'} colSpan={3}>
          {datesCodes.includes(property_code) && moment(by_initiator).isValid()
            ? moment(by_initiator).format('DD.MM.YYYY')
            : by_initiator || '-'}
        </TableCell>
        <TableCell data-marker={'by_executor'} colSpan={2}>
          {datesCodes.includes(property_code) && moment(by_executor).isValid()
            ? moment(by_executor).format('DD.MM.YYYY')
            : by_executor || '-'}
        </TableCell>
        {Boolean(AKO_STATUSES.includes(status)) && (
          <TableCell data-marker={'by_ako'} colSpan={2}>
            {datesCodes.includes(property_code) && moment(by_ako).isValid()
              ? moment(by_ako).format('DD.MM.YYYY')
              : by_ako || '-'}
          </TableCell>
        )}

        {actions ? (
          <TableCell data-marker={'actions'} colSpan={1}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <CircleButton
                title={t('CONTROLS.EDIT')}
                color={'blue'}
                type={'edit'}
                size={'small'}
                dataMarker={'edit-char'}
                disabled={!editable}
                onClick={handleEditClick}
              />
              <CircleButton
                title={t('CONTROLS.APPLY')}
                color={'green'}
                type={'done'}
                size={'small'}
                dataMarker={'apply-char'}
                disabled={!editable || !handleApplyClick}
                onClick={handleApplyClick}
              />
            </div>
          </TableCell>
        ) : (
          <TableCell colSpan={1} />
        )}
      </TableRow>
    </>
  );
};
