export const saveAsFile = (response, filename, type) => {
  const blob = new Blob([response], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(function () {
    window.URL.revokeObjectURL(url);
  }, 100);
};
