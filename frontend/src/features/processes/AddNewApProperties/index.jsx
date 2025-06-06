import { Grid } from '@material-ui/core';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Page from '../../../Components/Global/Page';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import DelegateBtn from '../../delegate/delegateBtn';
import Statuses from '../../../Components/Theme/Components/Statuses';
import DelegateInput from '../../delegate/delegateInput';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import SimpleImportModal from '../../../Components/Modal/SimpleImportModal';
import CancelModal from '../../../Components/Modal/CancelModal';
import { UploadedFilesTable } from '../../../Components/pages/Processes/Components/UploadedFilesTable';
import { checkPermissions } from '../../../util/verifyRole';
import { useTranslation } from 'react-i18next';
import { useCreateNewApPropertiesMutation, useNewApPropertiesQuery, useUpdateNewApPropertiesMutation } from './api';
import { sockets } from '../../../app/sockets';
import SelectField from "../../../Components/Theme/Fields/SelectField";

const LOG_TAGS = ['Запит на додавання нових характеристик ТКО'];
export const NEW_AP_PROPERTIES_INITIALIZATION_ACCEPT_ROLES = ['АТКО', 'АКО_Процеси'];

const AddNewApProperties = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { uid } = useParams();
	const { full_name, activeOrganization } = useSelector(({ user }) => user);
	const [openUpload, setOpenUpload] = useState(false);
	const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
	const [delegating, setDelegating] = useState(false);
	const {
		currentData,
		isFetching: fetchingData,
		error: notFound,
		refetch
	} = useNewApPropertiesQuery(uid, { skip: !uid });
	const [create, { isLoading: creating }] = useCreateNewApPropertiesMutation();
	const [update, { isLoading: updating, error }] = useUpdateNewApPropertiesMutation();

	const [data, setData] = useState({
		template_type: '',
		action_type: '',
	});

	useEffect(() => {
		if (uid && sockets.connection.auth) {
			sockets.joinProcess(uid);
			sockets.connection.on('message', ({ type, payload }) => {
				if (type === 'PROCESS_UPDATED' && payload?.process_uid === uid) {
					refetch();
				}
			});
		}
	}, [uid, sockets.connection.auth, refetch]);

	useEffect(
		() => () => {
			sockets.leaveProcess(uid);
		},
		[uid]
	);

	const handleStart = () => {
		create(data).then((response) => {
			if (response.data) navigate(`/processes/new-ap-properties/${response.data}`);
		});
	};

	const handleRemove = () => {
		update({ uid, type: 'cancel' }).then(() => setOpenRemoveDialog(false));
	};

	const handleComplete = () => {
		update({ uid, type: 'complete' });
	};

	const handleUpload = (formData) => {
		update({ uid, type: 'upload', body: formData }).then(() => setOpenUpload(false));
	};

	const handleChange = (id) => (value) => {
		if (id === 'template_type') {
			setData({ [id]: value, action_type: value === '103-13' ? 'add_location_id' : '' })
		} else {
			setData({ ...data, action_type: value })
		}
	};

	return (
		<Page
			pageName={uid ? t('PAGES.ADD_NEW_AP_PROPERTIES_ID', { id: currentData?.id }) : t('PAGES.ADD_NEW_AP_PROPERTIES')}
			backRoute={'/processes'}
			acceptPermisions={uid ? 'PROCESSES.NEW_AP_PROPERTIES.ACCESS' : 'PROCESSES.NEW_AP_PROPERTIES.INITIALIZATION'}
			acceptRoles={uid ? NEW_AP_PROPERTIES_INITIALIZATION_ACCEPT_ROLES : ['АТКО']}
			faqKey={'PROCESSES__NEW_AP_PROPERTIES'}
			notFoundMessage={notFound && t('REQUEST_NOT_FOUND')}
			loading={fetchingData || creating || delegating || updating}
			controls={
				<>
					{checkPermissions('PROCESSES.NEW_AP_PROPERTIES.CONTROLS.CREATE', ['АТКО']) && !uid && (
						<CircleButton
							type={'create'}
							onClick={handleStart}
							title={t('CONTROLS.TAKE_TO_WORK')}
							disabled={fetchingData || !data.action_type}
						/>
					)}
					{currentData?.can_cancel && (
						<CircleButton
							type={'remove'}
							onClick={() => setOpenRemoveDialog(true)}
							title={t('CONTROLS.CANCEL_PROCESS')}
							disabled={fetchingData || currentData?.processing}
						/>
					)}
					{currentData?.can_delegate && (
						<DelegateBtn
							process_uid={uid}
							onStarted={() => setDelegating(true)}
							onFinished={() => setDelegating(false)}
							onSuccess={() => window.location.reload()}
							disabled={currentData?.processing}
						/>
					)}
					{currentData?.can_upload && (
						<CircleButton
							type={'upload'}
							onClick={() => setOpenUpload(true)}
							title={t('CONTROLS.IMPORT')}
							disabled={fetchingData || currentData?.processing}
						/>
					)}
					{currentData?.can_complete && (
						<CircleButton
							type={'done'}
							onClick={handleComplete}
							title={t('CONTROLS.DONE_PROCESS')}
							disabled={fetchingData || currentData?.processing}
						/>
					)}
				</>
			}
		>
			<Statuses
				statuses={['NEW', 'IN_PROCESS', 'DONE', 'PARTIALLY_DONE', 'CANCELED']}
				currentStatus={currentData?.status || 'NEW'}
			/>
			<div className={'boxShadow'} style={{ padding: 24, marginTop: 16 }}>
				<Grid container spacing={3} alignItems={'center'}>
					<Grid item xs={12} lg={3}>
						<DelegateInput
							label={t('FIELDS.USER_INITIATOR')}
							disabled
							value={uid ? currentData?.executor?.username : full_name}
							data={currentData?.delegation_history || []}
						/>
					</Grid>
					<Grid item xs={12} md={6} lg={3}>
						<StyledInput
							label={t('FIELDS.CREATED_AT')}
							disabled
							value={currentData?.created_at && moment(currentData?.created_at).format('DD.MM.yyyy • HH:mm')}
						/>
					</Grid>
					<Grid item xs={12} md={6} lg={3}>
						<StyledInput
							label={
								currentData?.status?.includes('CANCELED') ? t('FIELDS.CANCELED_AT') : t('FIELDS.COMPLETE_DATETIME')
							}
							disabled
							value={currentData?.finished_at && moment(currentData?.finished_at).format('DD.MM.yyyy • HH:mm')}
						/>
					</Grid>
					<Grid item xs={12} md={6} lg={3}>
						<StyledInput label={t('FIELDS.UNIQUE_APS')} disabled value={currentData?.successful?.toString()}/>
					</Grid>
					<Grid item xs={12} lg={6}>
						<StyledInput
							label={t('FIELDS.INITIATOR_COMPANY')}
							disabled
							value={uid ? currentData?.executor_company?.short_name : activeOrganization?.name}
						/>
					</Grid>
					<Grid item xs={12} lg={6}>
						<StyledInput label={t('FIELDS.AP_TYPE')} disabled value={t('PLATFORM.INSTALLATION_AP')}/>
					</Grid>
					<Grid item xs={12} md={6} lg={3}>
						<SelectField
							label={t('FIELDS.TEMPLATE')}
							value={data.template_type || currentData?.template_type}
							dataMarker={'template_type'}
							disabled={uid}
							ignoreI18
							data={[
								{
									label: `${t('CHARACTERISTICS.REFERENCE_GROUP')} (106-12)`,
									value: '106-12'
								},
								{
									label: `${t('CHARACTERISTICS.CATUTTC')} (103-13)`,
									value: '103-13'
								},
							]}
							onChange={handleChange('template_type')}
						/>
					</Grid>
					{data?.template_type === '106-12' || currentData?.template_type === '106-12' &&
						<Grid item xs={12} md={6} lg={3}>
							<SelectField
								label={t('FIELDS.ACTION_TYPE')}
								value={data.action_type || currentData?.action_type}
								dataMarker={'action_type'}
								disabled={uid}
								data={[
									{
										label: 'CHARACTERISTICS.REFERENCE_GROUP_ADD_EDIT',
										value: 'add_or_edit_reference_group'
									},
									{
										label: 'CHARACTERISTICS.REFERENCE_GROUP_REMOVE',
										value: 'remove_reference_group'
									},
									{
										label: 'add_location_id',
										value: 'add_location_id',
										hidden: true
									},
								]}
								onChange={handleChange('action_type')}
							/>
						</Grid>
					}
				</Grid>
			</div>
			{currentData?.uid && (
				<>
					<h3
						style={{
							fontSize: 16,
							fontWeight: 'normal',
							color: '#0D244D',
							lineHeight: 1.2,
							paddingBottom: 12,
							paddingTop: 18
						}}
					>
						{t('TOTAL_NUMBER_OF_FILES_UPLOADEDP_AS_PART_OF_THE_APPLICATION')}:
					</h3>
					<UploadedFilesTable files={currentData?.files || []} handleUpdateList={refetch} tags={LOG_TAGS}/>
				</>
			)}
			<SimpleImportModal
				title={t('IMPORT_AP_FILES')}
				openUpload={openUpload}
				setOpenUpload={setOpenUpload}
				uploading={updating}
				handleUpload={handleUpload}
				layoutList={[
					{
						key: 'file_original',
						label: t('IMPORT_FILE.SELECT_FILE_WITH_AP_INFORMAT', { format: '.xls, .xlsx, .xlsm' }),
						accept: '.xls,.xlsx,.xlsm',
						maxSize: 26214400,
						sizeError: t('VERIFY_MSG.MAX_FILE_SIZE', { size: 25 })
					},
					{
						key: 'file_original_key',
						label: t('IMPORT_FILE.SELECT_DIGITAL_SIGNATURE_FILE'),
						accept: '.p7s',
						maxSize: 40960,
						sizeError: t('VERIFY_MSG.UNCORRECT_SIGNATURE')
					}
				]}
				error={error}
			/>
			<CancelModal
				open={openRemoveDialog}
				text={t('DO_YOU_WANT_TO_CANCEL_THE_PROCESS')}
				submitType={'danger'}
				onSubmit={handleRemove}
				onClose={() => setOpenRemoveDialog(false)}
			/>
		</Page>
	);
};

export default AddNewApProperties;
