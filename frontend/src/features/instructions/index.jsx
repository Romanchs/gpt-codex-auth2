import useExportFileLog from '../../services/actionsLog/useEportFileLog';
import { INSTRUCTIONS_LOG_TAGS } from '../../services/actionsLog/constants';
import { useLazyMsFilesDownloadQuery } from '../../app/mainApi';
import Page from '../../Components/Global/Page';
import { useAddNewInstructionMutation, useInstructionsQuery } from './api';
import { Accordion, AccordionDetails, AccordionSummary, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { checkPermissions } from '../../util/verifyRole';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import { useTranslation } from 'react-i18next';
import { LightTooltip } from '../../Components/Theme/Components/LightTooltip';
import moment from 'moment';
import { ROLES } from '../../util/directories';
import { useEffect, useMemo, useState } from 'react';
import { AddEditInstructionModal } from './AddEditInstructionModal';
import { InstructionSettings } from './InstructionSettings';

const Instructions = () => {
  const { t, i18n } = useTranslation();
  const [openAddInstruction, setOpenAddInstruction] = useState(false);
  const [addNewInstruction, { isLoading }] = useAddNewInstructionMutation();
  const { data: instructions, isFetching, refetch} = useInstructionsQuery({
    isAdmin: checkPermissions('INSTRUCTIONS.FUNCTIONS.ADMIN', ['АКО_Довідники'])
  });

  useEffect(() => {refetch();}, [i18n.language])

  const chapters = useMemo(() => {
    if (!instructions) return [];

    return instructions.map((i) => ({ value: i.chapter, label: `INSTRUCTIONS.${i.chapter}` }));
  }, [instructions]);

  const handleAddInstruction = (params) => {
    const formData = new FormData();
    Object.entries(params).map(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
      } else formData.append(key, value);
    });

    addNewInstruction(formData);
  };

  return (
    <Page
      pageName={t('PAGES.INSTRUCTIONS')}
      backRoute={'/'}
      faqKey={'INFORMATION_BASE__INSTRUCTIONS'}
      loading={isFetching || isLoading}
      controls={
        checkPermissions('INSTRUCTIONS.CONTROLS.ADD', ['АКО_Довідники']) && (
          <CircleButton
            type={'add'}
            title={t('CONTROLS.ADD_INSTRUCTION')}
            onClick={() => setOpenAddInstruction(true)}
          />
        )
      }
    >
      {instructions?.map((row) => (
        <InstructionAccordion {...row} key={row.chapter} chapters={chapters} />
      ))}
      <AddEditInstructionModal
        open={openAddInstruction}
        chapters={chapters}
        onClose={() => setOpenAddInstruction(false)}
        onSubmit={handleAddInstruction}
      />
    </Page>
  );
};

const InstructionAccordion = ({ chapter, info, chapters }) => {
  const { t } = useTranslation();
  const exportFileLog = useExportFileLog(INSTRUCTIONS_LOG_TAGS);
  const [downloadFile] = useLazyMsFilesDownloadQuery();

  const handleDownloadInstruction = (uid, file_name) => {
    downloadFile({ id: uid, name: file_name });
    exportFileLog();
  };

  return (
    <>
      <Accordion>
        <AccordionSummary>{t(`INSTRUCTIONS.${chapter}`)}</AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <Table>
            <TableBody>
              {info?.map((v) => (
                <TableRow key={v.uid} data-marker={`instruction-${v.uid}`} sx={lastTableRowStyles}>
                  <TableCell data-marker={'name'} sx={textStyles}>
                    {v.instr_name}
                  </TableCell>
                  {checkPermissions('INSTRUCTIONS.FUNCTIONS.ADMIN', ['АКО_Довідники']) && (
                    <TableCell data-marker={'roles'} sx={{ ...textStyles, maxWidth: 150 }}>
                      {v.roles?.length === 1 && v.roles[0] === 'all'
                        ? t('ALL')
                        : v.roles?.map((r) => ROLES[r]).join(', ')}
                    </TableCell>
                  )}
                  <TableCell data-marker={'updated_at'} width={150} align="center" sx={textStyles}>
                    <LightTooltip title={t('LAST_UPDATE_DATE')}>
                      {v.updated_at ? moment(v.updated_at).format('DD.MM.YYYY • HH:mm') : '-'}
                    </LightTooltip>
                  </TableCell>
                  {checkPermissions('INSTRUCTIONS.FUNCTIONS.ADMIN', ['АКО_Довідники']) ? (
                    <TableCell data-marker={'upload'} width={55}>
                      <InstructionSettings instruction={v} chapter={chapter} chapters={chapters} onDownloadInstruction={handleDownloadInstruction} />
                    </TableCell>
                  ) : (
                    <TableCell data-marker={'download-cell'} width={55}>
                      <CircleButton
                        type={'download'}
                        size={'small'}
                        title={t('CONTROLS.DOWNLOAD')}
                        onClick={() => handleDownloadInstruction(v.file_uid, v.instr_name)}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

const textStyles = { color: '#567691', fontSize: 12 };
const lastTableRowStyles = {
  '&:last-child': {
    '& td, & th': {
      borderBottom: 'none'
    }
  }
};
export default Instructions;
