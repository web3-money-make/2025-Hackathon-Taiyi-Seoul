const clipboardCopy = (contents: string) =>
  new Promise<string>((resolve, reject) => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(contents)
          .then(() => resolve(contents))
          .catch(reject);
      } else {
        if (!document.queryCommandSupported('copy')) {
          alert('This browser does not support clipboard copy.');
          reject();
          return;
        }

        const textarea = document.createElement('textarea');
        textarea.value = contents;
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        resolve(contents);
      }
    } catch (error) {
      reject(error);
    }
  });

export default clipboardCopy;
