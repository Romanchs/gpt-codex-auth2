import Stack from '@mui/material/Stack';
import { Accordion, AccordionDetails, AccordionSummary, Box, Table, TableBody, Typography } from '@mui/material';
import { consistencyAccordion } from './styles';
import AccordionRow from './AccordionRow';

const ConsistencyAccordion = ({ data }) => {
  const getStatus = {
    OK: consistencyAccordion.statusIndicatorGreen,
    WARNING: consistencyAccordion.statusIndicatorOrange,
    FAILED: consistencyAccordion.statusIndicatorRed
  };

  return (
    <Accordion>
      <AccordionSummary>
        <Stack direction="row" sx={consistencyAccordion.accordionHeader}>
          <Typography>{data.group}</Typography>
          <Box sx={[consistencyAccordion.statusIndicator, getStatus[data.status]]}></Box>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <Table>
          <TableBody>
            {data.data.map((rowData) => (
              <AccordionRow key={rowData.name} data={rowData} />
            ))}
          </TableBody>
        </Table>
      </AccordionDetails>
    </Accordion>
  );
};

export default ConsistencyAccordion;
