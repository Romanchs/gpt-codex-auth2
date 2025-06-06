import { useTranslation } from 'react-i18next';
import { onUpdateApsData, useAuditApsData, useAuditIsCanceled } from '../../slice';
import React, { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material';
import CircleButton from '../../../../Components/Theme/Buttons/CircleButton';
import MpAccordion from './MpAccordion';
import { useDispatch } from 'react-redux';
import { checkPermissions } from '../../../../util/verifyRole';
import { AUDITS_WRITE_PERMISSION, AUDITS_WRITE_ROLES } from '../..';
import AddMpModal from './modals/AddMpModal';

const ApsAccordion = () => {
  const { t } = useTranslation();
  const [isButtonsVisible, setIsButtonsVisible] = useState(false);
  const dispatch = useDispatch();
  const [isAddMpModalOpen, setIsAddMpModalOpen] = useState(false);
  const aps = useAuditApsData();
  const isCanceled = useAuditIsCanceled();
  const isEditable = !isCanceled && checkPermissions(AUDITS_WRITE_PERMISSION, AUDITS_WRITE_ROLES);

  const handleAddMp = (ap) => {
    dispatch(
      onUpdateApsData({
        ...aps,
        ...ap
      })
    );
    setIsAddMpModalOpen(false);
  };

  const handleOpenAddApModal = (e) => {
    e.stopPropagation();
    setIsAddMpModalOpen(true);
  };

  return (
    <>
      <Accordion onChange={(_, expanded) => setIsButtonsVisible(expanded)}>
        <AccordionSummary>
          <Box sx={{ width: '100%' }} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            <p>{t('AUDIT.TECHNICAL_UNIT_OF_AP')}</p>
            {isEditable && isButtonsVisible && (
              <CircleButton
                size={'small'}
                type={'add'}
                title={t('AUDIT.ADD_AP_TO_TECHNICAL_UNIT')}
                onClick={handleOpenAddApModal}
                dataMarker={'add_to_tech'}
              />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          {Object.entries(aps).map(([eic, data], index) => (
            <MpAccordion index={++index} eic={eic} key={eic} data={data} />
          ))}
        </AccordionDetails>
      </Accordion>
      <AddMpModal
        title={t('AUDIT.ADD_AP_TO_TECHNICAL_UNIT')}
        open={isAddMpModalOpen}
        onClose={() => setIsAddMpModalOpen(false)}
        onSubmit={handleAddMp}
      />
    </>
  );
};

export default ApsAccordion;
