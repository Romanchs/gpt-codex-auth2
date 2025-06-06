export const MuiTextField = {
  styleOverrides: {
    root: ({ ownerState: { disabled } }) => ({
      '>.MuiInputBase-root': {
        cursor: disabled ? 'default' : 'pointer'
      },
      input: {
        color: disabled ? '#00000061' : '#567691',
        cursor: 'inherit',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        padding: '11px 14px'
      },
      label: {
        backgroundColor: '#fff',
        maxWidth: 'none',
        padding: '0 5px',
        marginLeft: -5,
        fontSize: 14,
        color: '#A9B9C6',
        '&.Mui-focused': {
          color: '#567691'
        },
        '&.Mui-error': {
          color: '#f44336'
        },
        '&.MuiInputLabel-shrink': { transform: 'translate(14px, -8px) scale(0.75)' },
        '&:not(.MuiInputLabel-shrink)': {
          transform: 'translate(14px, 11px) scale(1)',
          maxWidth: 'calc(100% - 10px)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      },
      fieldset: {
        borderRadius: '10px',
        border: '1px solid #D1EDF3'
      },
      '&:hover fieldset.MuiOutlinedInput-notchedOutline': {
        borderColor: '#AEDFEA'
      },
      '& .MuiInputBase-root.Mui-focused fieldset.MuiOutlinedInput-notchedOutline': {
        border: '1px solid #D1EDF3'
      }
    })
  }
};
