import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

function createCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
}
const CRC_TABLE = createCrcTable();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function generateAvinashPng(size, safeMarginRatio = 0.12) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  const cx = size / 2;
  const cy = size / 2;
  const pad = size * safeMarginRatio;

  for (let y = 0; y < size; y++) {
    const rowStart = y * (size * 4 + 1);
    raw[rowStart] = 0; // filter none
    for (let x = 0; x < size; x++) {
      const idx = rowStart + 1 + x * 4;
      const nx = x / size;
      const ny = y / size;

      // Obsidian background with subtle neon glow
      let r = 6 + Math.round(16 * nx);
      let g = 8 + Math.round(12 * (1 - ny));
      let b = 20 + Math.round(28 * ny);

      // Border glow ring inside safe area
      const distEdge = Math.min(x - pad, size - pad - x, y - pad, size - pad - y);
      if (distEdge >= 0 && distEdge < size * 0.025) {
        r = Math.round(34 * (1 - nx) + 236 * nx);
        g = Math.round(211 * (1 - nx) + 72 * nx);
        b = Math.round(238 * (1 - ny) + 153 * ny);
      }

      // Stylized 'A' prism legs inside central safe zone
      const relX = (x - cx) / (size * (0.5 - safeMarginRatio));
      const relY = (y - cy) / (size * (0.5 - safeMarginRatio)); // -1 to 1
      if (relY > -0.62 && relY < 0.65) {
        const halfSpread = (relY + 0.62) * 0.44;
        const distLeg = Math.abs(Math.abs(relX) - halfSpread);
        if (distLeg < 0.13) {
          if (relX < 0) {
            r = 34;
            g = 211;
            b = 238;
          } else {
            r = 192;
            g = 132;
            b = 252;
          }
        }
        // Center cyan play core
        if (relY > 0.08 && relY < 0.42 && relX > -0.14 && relX < 0.18 - Math.abs(relY - 0.25) * 1.4) {
          r = 34;
          g = 211;
          b = 238;
        }
      }

      raw[idx] = Math.min(255, Math.max(0, r));
      raw[idx + 1] = Math.min(255, Math.max(0, g));
      raw[idx + 2] = Math.min(255, Math.max(0, b));
      raw[idx + 3] = 255;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const idat = zlib.deflateSync(raw);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', idat),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

const pubDir = path.resolve('public');
if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });

fs.writeFileSync(path.join(pubDir, 'pwa-192x192.png'), generateAvinashPng(192, 0.08));
fs.writeFileSync(path.join(pubDir, 'pwa-512x512.png'), generateAvinashPng(512, 0.08));
fs.writeFileSync(path.join(pubDir, 'pwa-maskable-512x512.png'), generateAvinashPng(512, 0.16));
fs.writeFileSync(path.join(pubDir, 'apple-touch-icon.png'), generateAvinashPng(180, 0.08));
console.log('Generated compliant PNG icons successfully.');
