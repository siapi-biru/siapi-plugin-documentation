import { startsWith } from 'lodash';

const openWithNewTab = path => {
  const url = (() => {
    if (startsWith(path, '/')) {
      return `${siapi.backendURL}${path}`;
    }
    if (startsWith(path, 'https') || startsWith(path, 'http')) {
      return path;
    }

    return `${siapi.backendURL}/${path}`;
  })();

  window.open(url, '_blank');

  return window.focus();
};

export default openWithNewTab;
