import crypto from 'crypto';
import { fromBase32 } from './base32.js';

const hotp = ({ key, counter, digits = 6 }) => {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));

  const hmac = crypto.createHmac('sha1', key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const mod = 10 ** digits;
  return String(code % mod).padStart(digits, '0');
};

export const totpNow = ({ secretBase32, stepSeconds = 30, digits = 6, epoch = Date.now() }) => {
  const key = fromBase32(secretBase32);
  const counter = Math.floor(epoch / 1000 / stepSeconds);
  return hotp({ key, counter, digits });
};

export const verifyTotp = ({ secretBase32, token, window = 1, stepSeconds = 30, digits = 6, epoch = Date.now() }) => {
  const t = String(token || '').trim();
  if (!/^\d{6,8}$/.test(t)) return false;

  const key = fromBase32(secretBase32);
  const counter = Math.floor(epoch / 1000 / stepSeconds);

  for (let w = -window; w <= window; w++) {
    const code = hotp({ key, counter: counter + w, digits });
    if (crypto.timingSafeEqual(Buffer.from(code), Buffer.from(t.padStart(digits, '0').slice(-digits)))) return true;
  }
  return false;
};

