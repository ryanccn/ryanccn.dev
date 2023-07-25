const SECURE_RANDOM_SAFE = `${crypto.randomUUID()}-${crypto.randomUUID()}-${crypto.randomUUID()}-${crypto.randomUUID()}`;

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
  if (typeof string === 'object' && string.safe === SECURE_RANDOM_SAFE) {
    return string.value;
  }

  return String(string).replace(/[&<>"'`=/]/g, (s) => {
    return entityMap[s];
  });
};

const html = (s, ...f) => {
  return String.raw(s, ...f.map(escapeHtml));
};

const safe = (a) => ({ value: a, safe: SECURE_RANDOM_SAFE });

exports.html = html;
exports.safe = safe;
exports.escapeHtml = escapeHtml;
