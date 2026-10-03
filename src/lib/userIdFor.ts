/**
 * @file userIdFor.ts
 * @brief Stable users.id for an OIDC subject.
 *
 * dbal's `sub` is a username, but the API keys users by
 * UUID. The backend derives it as a UUIDv5 (URL namespace)
 * of `<iss>#<sub>`; this must stay byte-for-byte equal to
 * userIdFor() in platform-core auth/backend/keycloak.
 */

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// RFC 4122 URL namespace.
const NS = [
  0x6b, 0xa7, 0xb8, 0x11, 0x9d, 0xad, 0x11, 0xd1,
  0x80, 0xb4, 0x00, 0xc0, 0x4f, 0xd4, 0x30, 0xc8,
];

/** UTF-8 bytes of a string (TextEncoder is missing in jsdom). */
function utf8(str: string): number[] {
  return Array.from(unescape(encodeURIComponent(str)), (c) =>
    c.charCodeAt(0),
  );
}

const rotl = (x: number, n: number): number =>
  (x << n) | (x >>> (32 - n));

/** SHA-1 of a byte array (synchronous; inputs are tiny). */
function sha1(bytes: number[]): number[] {
  const bitLen = bytes.length * 8;
  const m = bytes.slice();
  m.push(0x80);
  while (m.length % 64 !== 56) m.push(0);
  for (let i = 7; i >= 0; i--) {
    m.push(i >= 4 ? 0 : (bitLen >>> (i * 8)) & 0xff);
  }
  let h0 = 0x67452301;
  let h1 = 0xefcdab89 | 0;
  let h2 = 0x98badcfe | 0;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0 | 0;
  for (let off = 0; off < m.length; off += 64) {
    const w: number[] = [];
    for (let i = 0; i < 16; i++) {
      w[i] =
        (m[off + i * 4]! << 24) |
        (m[off + i * 4 + 1]! << 16) |
        (m[off + i * 4 + 2]! << 8) |
        m[off + i * 4 + 3]!;
    }
    for (let i = 16; i < 80; i++) {
      w[i] = rotl(w[i - 3]! ^ w[i - 8]! ^ w[i - 14]! ^ w[i - 16]!, 1);
    }
    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    for (let i = 0; i < 80; i++) {
      let f: number;
      let k: number;
      if (i < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (i < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (i < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc | 0;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6 | 0;
      }
      const t = (rotl(a, 5) + f + e + k + w[i]!) | 0;
      e = d;
      d = c;
      c = rotl(b, 30);
      b = a;
      a = t;
    }
    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
  }
  const out: number[] = [];
  for (const h of [h0, h1, h2, h3, h4]) {
    out.push((h >>> 24) & 0xff, (h >>> 16) & 0xff, (h >>> 8) & 0xff, h & 0xff);
  }
  return out;
}

/**
 * Map a token subject to the backend's users.id.
 *
 * @param issuer - token `iss` claim
 * @param sub - token `sub` claim
 * @returns lower-case UUID string
 */
export function userIdFor(issuer: string, sub: string): string {
  if (UUID_RE.test(sub)) return sub;
  const h = sha1([...NS, ...utf8(`${issuer}#${sub}`)]);
  h[6] = (h[6]! & 0x0f) | 0x50;
  h[8] = (h[8]! & 0x3f) | 0x80;
  const hex = h.slice(0, 16).map((b) => b.toString(16).padStart(2, '0'));
  return [
    hex.slice(0, 4).join(''),
    hex.slice(4, 6).join(''),
    hex.slice(6, 8).join(''),
    hex.slice(8, 10).join(''),
    hex.slice(10, 16).join(''),
  ].join('-');
}
