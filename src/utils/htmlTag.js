import { timingSafeEqual } from 'node:crypto';

const SECURE_RANDOM_SAFE = `${crypto.randomUUID()}-${crypto.randomUUID()}-${crypto.randomUUID()}-${crypto.randomUUID()}`;

class SafeValue {
  constructor(inner) {
    this.inner = inner;
    this.secret = SECURE_RANDOM_SAFE;
  }

  verify(secret) {
    if (this.secret.length !== secret.length) return false;

    const encoder = new TextEncoder();
    const [buf1, buf2] = [encoder.encode(this.secret), encoder.encode(secret)];
    if (buf1.byteLength !== buf2.byteLength) return false;

    return timingSafeEqual(buf1, buf2);
  }
}

const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

const escapeHtml = (value) => {
  if (value instanceof SafeValue && value.verify(SECURE_RANDOM_SAFE))
    return String(value.inner);

  return String(value).replaceAll(/["&'/<=>`]/g, (s) => entityMap[s]);
};

const html = (s, ...f) => {
  return String.raw({ raw: s }, ...f.map((e) => escapeHtml(e)));
};

const safe = (value) => {
  return new SafeValue(value);
};

export { html, safe, escapeHtml };
