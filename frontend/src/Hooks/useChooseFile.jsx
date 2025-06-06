import { useEffect } from 'react';

const useChooseFile = (fileTypes, fileHandler, id) => {
  const fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.setAttribute('accept', fileTypes.join(','));
  fileSelector.setAttribute('id', id);
  fileSelector.onchange = fileHandler;

  const removeInput = () => {
    try {
      document.removeChild(fileSelector);
    } catch (e) {
      console.log('Input not found');
    }
  };

  useEffect(() => {
    return () => {
      removeInput();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return fileSelector;
};

export default useChooseFile;
