import Dialog from '@material-ui/core/Dialog';
import makeStyles from '@material-ui/core/styles/makeStyles';
import IconButton from '@material-ui/core/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: '27px 40px 32px',
    minWidth: 560,
    [theme.breakpoints.down('md')]: {
      padding: '21px 20px 36px'
    }
  },
  close: {
    position: 'absolute',
    right: 16,
    top: 16,

    '& svg': {
      fontSize: 21
    }
  },
  header: {
    color: '#000',
    fontSize: 15,
    fontWeight: 400,
    lineHeight: 1.4,
    paddingRight: 40,
    paddingBottom: 8,
    paddingTop: 4,
    [theme.breakpoints.down('md')]: {
      paddingRight: 30,
      fontSize: 14
    }
  }
}));

export const ModalWrapper = ({ open, onClose, header, children, maxWidth, fullWidth = false, dataMarker, ...rest }) => {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        'data-marker': dataMarker
      }}
      {...rest}
    >
      <div className={classes.root}>
        {onClose && (
          <IconButton onClick={onClose} className={classes.close} data-marker={'close-dialog'}>
            <CloseRounded />
          </IconButton>
        )}
        <h4 className={classes.header}>{header}</h4>
        {children}
      </div>
    </Dialog>
  );
};
