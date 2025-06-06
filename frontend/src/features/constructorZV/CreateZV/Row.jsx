import { TableBody } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import UpdateRounded from '@mui/icons-material/UpdateRounded';
import { useState } from 'react';
import { useRowStyles } from '../../pm/filterStyles';
import { useUpdateZvGroupMutation } from '../api';
import { LightTooltip } from '../../../Components/Theme/Components/LightTooltip';
import { useTranslation } from "react-i18next";
import useRefreshDataLog from '../../../services/actionsLog/useRefreshDataLog';
import { CONSTRUCTOR_ZV_LOG_TAGS } from '../../../services/actionsLog/constants';

const Row = ({ data, columns, innerColumns, aggregation }) => {
  const {t} = useTranslation();
  const classes = useRowStyles();
  const [open, setOpen] = useState(false);
  const [updateGroup] = useUpdateZvGroupMutation({fixedCacheKey: 'Update_zv_group' });
  const refreshDataLog = useRefreshDataLog(CONSTRUCTOR_ZV_LOG_TAGS);

  const getData = (id, value) => {
    return (
      <TableCell data-marker={id} key={'cell' + id}>
        {value || '-'}
      </TableCell>
    );
  };

  const handleUpdateGroup = () => {
    updateGroup({uid: data?.uid, name: aggregation.name});
    refreshDataLog();
  }

  return (
    <>
      <TableRow className={open ? classes.rootOpen : classes.root} data-marker={'table-row'}>
        {columns.map(({ id, value }) => getData(id, value ? data[value] : data[id], data))}
        <TableCell>
          <Box display={'flex'} gridGap={5}>
            <LightTooltip title={t('UPDATE_AGGREGATION_GROUP')}>
              <IconButton
                aria-label={'update row'}
                size={'small'}
                onClick={handleUpdateGroup}
                className={classes.collapse}
                data-marker={'update'}
              >
                {<UpdateRounded />}
              </IconButton>
            </LightTooltip>
            <IconButton
              aria-label={'expand row'}
              size={'small'}
              onClick={() => setOpen(!open)}
              className={open ? classes.expand : classes.collapse}
              data-marker={open ? 'expand' : 'collapse'}
            >
              {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow className={classes.detail} data-marker={'table-row--detail'}>
        <TableCell
          style={{
            paddingBottom: 8,
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0
          }}
          colSpan={columns.length + 2}
        >
          <Collapse in={open} timeout={'auto'} unmountOnExit>
            <Box margin={1} className={classes.detailContainer}>
              <Table size={'small'} aria-label={'purchases'}>
                <TableHead>
                  <TableRow className={`${classes.head} ${classes.splitter}`}>
                    {innerColumns.map(({ label, id }, index) => (
                      <TableCell key={'head-cell' + index} data-marker={'head--' + id}>
                        <pre style={{ font: 'inherit' }}>{t(label)}</pre>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.zvs?.map((item, index) => (
                    <TableRow
                      key={'row' + index}
                      className={`
                        ${classes.body} 
                        ${classes.innerTableRow} 
                        ${data?.zvs?.length - 1 !== index && classes.splitter}
                      `}
                    >
                      {innerColumns.map(({ id }, i) => (
                        <TableCell key={'row' + i} data-marker={'body--' + id}>
                          <pre style={{ font: 'inherit' }}>{item[id]}</pre>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;
