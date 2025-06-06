import { checkPermissions } from '../../../../util/verifyRole';
import IconButton from '@mui/material/IconButton';
import ArchiveRounded from '@mui/icons-material/ArchiveRounded';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

const Row = ({ data, columns, handleArchive }) => {
  return (
    <>
      <TableRow data-marker="table-row" style={{ opacity: data?.archived ? 0.7 : 1 }}>
        {columns?.map((name, titleIndex) => {
          return (
            <TableCell
              data-marker={name}
              className={'styled'}
              key={`cell-${titleIndex}`}
            >
              {data[name]}
            </TableCell>
          );
        })}
        {checkPermissions('DIRECTORIES.DEFAULT.FUNCTIONS.ARCHIVE', 'АКО_Довідники') && !data?.archived ? (
          <TableCell className={'styled'} width={50} data-marker={'archive'}>
            <IconButton
              onClick={() => handleArchive(data)}
              style={{
                position: 'absolute',
                right: 3,
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            >
                <ArchiveRounded style={{ color: '#f90000' }} />
            </IconButton>
          </TableCell>
        ) : (
          <TableCell className={'styled'} />
        )}
      </TableRow>
      <TableRow data-marker="table-row_empty">
        <TableCell
          style={{ paddingBottom: 8, paddingTop: 0, paddingLeft: 0, paddingRight: 0 }}
          className={'styled spacer'}
          colSpan={columns.length}
        ></TableCell>
      </TableRow>
    </>
  );
};

export default Row;
