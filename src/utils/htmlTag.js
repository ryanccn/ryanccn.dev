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

const escapeHtml = (value) => {
  if (typeof value === 'object' && value.safe === SECURE_RANDOM_SAFE) {
    return value.value;
  }

  return String(value).replace(/[&<>"'`=/]/g, (s) => entityMap[s]);
};

const html = (s, ...f) => {
  return String.raw({ raw: s }, ...f.map(escapeHtml));
};

const safe = (value) => {
  return { value, safe: SECURE_RANDOM_SAFE };
};

exports.html = html;
exports.safe = safe;
exports.escapeHtml = escapeHtml;
