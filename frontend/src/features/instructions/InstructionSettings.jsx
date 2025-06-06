import { IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PublishIcon from '@mui/icons-material/Publish';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SimpleImportModal from '../../Components/Modal/SimpleImportModal';
import { useDeleteInstructionMutation, useEditInstructionMutation, useUploadInstructionMutation } from './api';
import CancelModal from '../../Components/Modal/CancelModal';
import { AddEditInstructionModal } from './AddEditInstructionModal';

export const InstructionSettings = ({ instruction, onDownloadInstruction, chapter, chapters }) => {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [updateFileOpen, setUpdateFileOpen] = useState(false);
  const [deleteInstructionOpen, setDeleteInstructionOpen] = useState(false);
  const [openEditInstruction, setOpenEditInstruction] = useState(false);
  const [uploadFile, { isLoading: uploading, error: uploadError }] = useUploadInstructionMutation();
  const [deleteInstruction] = useDeleteInstructionMutation();
  const [editInstruction] = useEditInstructionMutation();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = () => {
    onDownloadInstruction(instruction.file_uid, instruction.instr_name);
    handleClose();
  };

  const handleDelete = () => {
    deleteInstruction({
      instr_uid: instruction.uid,
      file_uid: instruction.file_uid
    }).then(() => setDeleteInstructionOpen(false));
  };

  const handleEditInstruction = (params) => {
    const body = {
      instr_uid: instruction.uid,
      file_uid: instruction.file_uid,
      ...params
    };
    editInstruction(body);
  };

  const handleOpenDeleteModal = () => {
    setAnchorEl(null);
    setDeleteInstructionOpen(true);
  };

  const handleOpenEditModal = () => {
    setAnchorEl(null);
    setOpenEditInstruction(true);
  };

  const handleOpenUpdateFileModal = () => {
    setAnchorEl(null);
    setUpdateFileOpen(true);
  };

  return (
    <>
      <IconButton size={'small'} onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="instruction-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        <MenuItem onClick={handleDownload}>
          <ListItemIcon>
            <FileDownloadIcon color="primary" size="small" />
          </ListItemIcon>
          <Typography variant="inherit">{t('CONTROLS.DOWNLOAD')}</Typography>
        </MenuItem>
        <MenuItem onClick={handleOpenUpdateFileModal}>
          <ListItemIcon>
            <PublishIcon color="primary" size="small" />
          </ListItemIcon>
          <Typography variant="inherit">{t('CONTROLS.IMPORT_FILE')}</Typography>
        </MenuItem>
        <MenuItem onClick={handleOpenEditModal}>
          <ListItemIcon>
            <EditIcon color="success" size="small" />
          </ListItemIcon>
          <Typography variant="inherit">{t('CONTROLS.EDIT')}</Typography>
        </MenuItem>
        <MenuItem onClick={handleOpenDeleteModal}>
          <ListItemIcon>
            <DeleteIcon color="error" size="small" />
          </ListItemIcon>
          <Typography variant="inherit">{t('CONTROLS.DELETE_INSTRUCTION')}</Typography>
        </MenuItem>
      </Menu>
      <SimpleImportModal
        title={t('IMPORT_FILE.IMPORT_NEW_FILE')}
        openUpload={updateFileOpen}
        canUploadWithoutKey
        setOpenUpload={setUpdateFileOpen}
        handleUpload={(formData) => {
          uploadFile({ uid: instruction.uid, file_uid: instruction.file_uid, body: formData }).then(() => {
            setUpdateFileOpen(false);
          });
        }}
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.SELECT_FILE_FORMAT', { format: '.pdf, .xls, .xlsm, .xlsx, .zip, .xml' }),
            accept: '.pdf,.xls,.xlsm,.xlsx,.zip,.xml'
          }
        ]}
        uploading={uploading}
        error={uploadError}
      />
      <CancelModal
        text={t('MODALS.ARE_YOU_SURE_YOU_WANT_TO_DELETE_INSTRUCTION')}
        open={deleteInstructionOpen}
        onClose={() => setDeleteInstructionOpen(false)}
        onSubmit={handleDelete}
      />
      <AddEditInstructionModal
        open={openEditInstruction}
        chapters={chapters}
        onClose={() => setOpenEditInstruction(false)}
        onSubmit={handleEditInstruction}
        instruction={{
          chapter,
          roles: instruction.roles,
          language: i18n.language,
          instr_name: instruction.instr_name
        }}
      />
    </>
  );
};
