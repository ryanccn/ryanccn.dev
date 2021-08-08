const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

const escapeHtml = (string) => {
  if (typeof string === 'object' && string.safe === true) {
    return string.value;
  }

  return String(string).replace(/[&<>"'`=\/]/g, (s) => {
    return entityMap[s];
  });
};

const html = (s, ...f) => {
  return String.raw(s, ...f.map(escapeHtml));
};

module.exports = html;
