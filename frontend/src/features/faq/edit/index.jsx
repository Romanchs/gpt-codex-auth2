import Page from '../../../Components/Global/Page';
import { ADMIN_PERMISSION, ADMIN_ROLES } from '../utils';
import { MOCK_UID, STATUS, useRoutes } from '../data';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFaqLanguage } from '../slice';
import { useCreateFaqMutation, useFaqByUidQuery, useFaqTemplatesQuery, useUpdateFaqMutation } from '../api';
import { useQuill } from 'react-quilljs';
import BlotFormatter from 'quill-blot-formatter';
import 'quill/dist/quill.snow.css';
import './editor.css';
import Paper from '@mui/material/Paper';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import CancelModal from '../../../Components/Modal/CancelModal';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const Edit = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { chapter, page, uid } = useParams();
  const { pathname } = useLocation();
  const isMock = uid === MOCK_UID;
  const language = useFaqLanguage();
  const routes = useRoutes();
  const { currentData } = useFaqTemplatesQuery({ language }, { skip: isMock });
  const template = !isMock && currentData?.find((i) => i.uid === uid);
  const { data } = useFaqByUidQuery({ uid }, { skip: isMock });
  const [onCreate, { isLoading: isCreating }] = useCreateFaqMutation();
  const [onUpdate, { isLoading }] = useUpdateFaqMutation();
  const content = data?.content || '';
  const [open, setOpen] = useState(false);

  const pageData = useMemo(() => {
    const ch = routes.find((c) => c.route === chapter);
    const p = ch.pages.find((p) => p.route === page);
    return {
      pageName: `${t(ch?.name)} / ${t(p?.name)} / ${template?.template_name || 'За замовчуванням'}`,
      page: p
    };
  }, [routes, chapter, template]);

  const { quill, quillRef, Quill } = useQuill({
    theme: 'snow',
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      blotFormatter: {}
    }
  });

  if (Quill && !quill) {
    const AlignClass = Quill.import('attributors/style/align');
    Quill.register(AlignClass, true);
    Quill.register('modules/blotFormatter', BlotFormatter);
  }

  useEffect(() => {
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(content);
    }
  }, [quill, Quill, content]);

  const handleSave = () => {
    const content = quillRef.current.firstChild.innerHTML;
    if (isMock) {
      onCreate({
        key: pageData.page.apiKey,
        status: STATUS.DEFAULT,
        roles: [],
        content,
        language
      }).then((res) => {
        if (res?.data?.uid) {
          setTimeout(() => {
            navigate(pathname.replace('/default/edit', '/' + res.data.uid));
          }, 100);
        }
      });
    } else {
      onUpdate({
        uid,
        content
      }).then(() => {
        navigate(pathname.replace('/edit', ''));
      });
    }
  };

  return (
    <Page
      pageName={pageData.pageName}
      backRoute={`/faq/${chapter}/${page}/${uid}`}
      acceptRoles={ADMIN_ROLES}
      acceptPermisions={ADMIN_PERMISSION}
      controls={<CircleButton type={'save'} onClick={() => setOpen(true)} title={t('CONTROLS.SAVE')} />}
    >
      <Paper variant={'elevation'} sx={{ p: 2, height: 'calc(100vh - 120px)', position: 'relative' }} elevation={4}>
        <div ref={quillRef} />
      </Paper>
      <CancelModal
        onClose={() => setOpen(false)}
        onSubmit={handleSave}
        text={t('SAVE_CHANGES') + '?'}
        open={open}
        submitType={'green'}
        disabledSubmit={isLoading || isCreating}
      />
    </Page>
  );
};

export default Edit;
