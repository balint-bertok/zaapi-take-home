#!/usr/bin/env node
// Generates src/features/auth/onboarding/qr.ts: the onboarding modal's QR code as one SVG path,
// so the demo draws a real, scannable code with no runtime library and no network.
// The real app encodes a demo chat link; the demo encodes its own public URL instead.
// Fixed to QR version 5, error correction Q, byte mode: a 37-module square like the saved page's
// `viewBox="0 0 37 37"`, with enough redundancy that the logo drawn over the centre stays readable.
// Algorithm after ISO/IEC 18004 as laid out in Project Nayuki's QR Code generator (MIT).
import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const TEXT = "https://balint-bertok.github.io/zaapi-take-home/";
const SIZE = 37; // version 5
const ALIGN = [6, 30];
const EC_PER_BLOCK = 18;
const BLOCKS = [15, 15, 16, 16]; // data codewords per block at version 5, level Q
const EC_FORMAT_BITS = 3; // level Q

const out = join(resolve(dirname(fileURLToPath(import.meta.url)), ".."), "src/features/auth/onboarding/qr.ts");

// --- data codewords: byte mode, length, payload, terminator, padding
const bytes = [...new TextEncoder().encode(TEXT)];
const capacity = BLOCKS.reduce((a, b) => a + b, 0);
const bits = [];
const push = (value, length) => {
  for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1);
};
push(0b0100, 4);
push(bytes.length, 8);
bytes.forEach((b) => push(b, 8));
if (bits.length > capacity * 8) throw new Error("text too long for version 5-Q");
push(0, Math.min(4, capacity * 8 - bits.length));
push(0, (8 - (bits.length % 8)) % 8);
for (let pad = 0xec; bits.length < capacity * 8; pad ^= 0xec ^ 0x11) push(pad, 8);
const data = [];
for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(""), 2));

// --- Reed-Solomon over GF(256), primitive polynomial 0x11D
const mul = (x, y) => {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z;
};
const divisor = Array(EC_PER_BLOCK).fill(0);
divisor[EC_PER_BLOCK - 1] = 1;
for (let i = 0, root = 1; i < EC_PER_BLOCK; i++, root = mul(root, 0x02)) {
  for (let j = 0; j < EC_PER_BLOCK; j++) {
    divisor[j] = mul(divisor[j], root);
    if (j + 1 < EC_PER_BLOCK) divisor[j] ^= divisor[j + 1];
  }
}
const remainder = (block) => {
  const result = Array(EC_PER_BLOCK).fill(0);
  for (const b of block) {
    const factor = b ^ result.shift();
    result.push(0);
    divisor.forEach((d, i) => (result[i] ^= mul(d, factor)));
  }
  return result;
};

// --- split into blocks, add EC, interleave
const blocks = [];
let offset = 0;
for (const n of BLOCKS) {
  blocks.push(data.slice(offset, offset + n));
  offset += n;
}
const ecc = blocks.map(remainder);
const codewords = [];
for (let i = 0; i < Math.max(...BLOCKS); i++) blocks.forEach((b) => i < b.length && codewords.push(b[i]));
for (let i = 0; i < EC_PER_BLOCK; i++) ecc.forEach((e) => codewords.push(e[i]));

// --- function patterns
const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
const reserved = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
const set = (x, y, dark) => {
  grid[y][x] = dark;
  reserved[y][x] = true;
};
for (let i = 0; i < SIZE; i++) {
  set(6, i, i % 2 === 0);
  set(i, 6, i % 2 === 0);
}
for (const [cx, cy] of [
  [3, 3],
  [SIZE - 4, 3],
  [3, SIZE - 4],
]) {
  for (let dy = -4; dy <= 4; dy++)
    for (let dx = -4; dx <= 4; dx++) {
      const d = Math.max(Math.abs(dx), Math.abs(dy));
      const x = cx + dx;
      const y = cy + dy;
      if (x >= 0 && x < SIZE && y >= 0 && y < SIZE) set(x, y, d !== 2 && d !== 4);
    }
}
for (const ax of ALIGN)
  for (const ay of ALIGN) {
    if ((ax === 6 && ay === 6) || (ax === 6 && ay === SIZE - 7) || (ax === SIZE - 7 && ay === 6)) continue;
    for (let dy = -2; dy <= 2; dy++)
      for (let dx = -2; dx <= 2; dx++) set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
  }
const drawFormat = (mask) => {
  const value = (EC_FORMAT_BITS << 3) | mask;
  let rem = value;
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
  const f = ((value << 10) | rem) ^ 0x5412;
  const bit = (i) => ((f >>> i) & 1) === 1;
  for (let i = 0; i <= 5; i++) set(8, i, bit(i));
  set(8, 7, bit(6));
  set(8, 8, bit(7));
  set(7, 8, bit(8));
  for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
  for (let i = 0; i < 8; i++) set(SIZE - 1 - i, 8, bit(i));
  for (let i = 8; i < 15; i++) set(8, SIZE - 15 + i, bit(i));
  set(8, SIZE - 8, true);
};
drawFormat(0); // reserves the format areas before data placement

// --- data placement in the zigzag
let i = 0;
for (let right = SIZE - 1; right >= 1; right -= 2) {
  if (right === 6) right = 5;
  for (let vert = 0; vert < SIZE; vert++)
    for (let j = 0; j < 2; j++) {
      const x = right - j;
      const y = ((right + 1) & 2) === 0 ? SIZE - 1 - vert : vert;
      if (!reserved[y][x] && i < codewords.length * 8) {
        grid[y][x] = ((codewords[i >>> 3] >>> (7 - (i & 7))) & 1) === 1;
        i++;
      }
    }
}

// --- masking: try all eight, keep the lowest penalty
const masks = [
  (x, y) => (x + y) % 2,
  (x, y) => y % 2,
  (x) => x % 3,
  (x, y) => (x + y) % 3,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2,
  (x, y) => ((x * y) % 2) + ((x * y) % 3),
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2,
];
const applyMask = (m) => {
  for (let y = 0; y < SIZE; y++)
    for (let x = 0; x < SIZE; x++) if (!reserved[y][x] && masks[m](x, y) === 0) grid[y][x] = !grid[y][x];
};
const penalty = () => {
  let score = 0;
  const lines = [...grid, ...grid[0].map((_, x) => grid.map((row) => row[x]))];
  for (const line of lines) {
    let run = 1;
    for (let k = 1; k <= line.length; k++) {
      if (k < line.length && line[k] === line[k - 1]) run++;
      else {
        if (run >= 5) score += run - 2;
        run = 1;
      }
    }
    const s = line.map(Number).join("");
    score += 40 * ((s.match(/(?=10111010000)/g) ?? []).length + (s.match(/(?=00001011101)/g) ?? []).length);
  }
  for (let y = 0; y < SIZE - 1; y++)
    for (let x = 0; x < SIZE - 1; x++) {
      const c = grid[y][x];
      if (c === grid[y][x + 1] && c === grid[y + 1][x] && c === grid[y + 1][x + 1]) score += 3;
    }
  const dark = grid.flat().filter(Boolean).length;
  score += Math.floor(Math.abs(dark * 20 - SIZE * SIZE * 10) / (SIZE * SIZE)) * 10;
  return score;
};
let best = 0;
let bestScore = Infinity;
for (let m = 0; m < 8; m++) {
  applyMask(m);
  drawFormat(m);
  const score = penalty();
  if (score < bestScore) [best, bestScore] = [m, score];
  applyMask(m); // XOR again to undo
}
applyMask(best);
drawFormat(best);

// --- one path, a unit square per dark module, as qrcode.react draws it
let d = "";
grid.forEach((row, y) => row.forEach((dark, x) => dark && (d += `M${x} ${y}h1v1h-1z`)));
writeFileSync(
  out,
  `// Generated by scripts/generate-qr.mjs. Do not edit by hand.\n` +
    `// QR code (version 5, level Q) for ${TEXT}\n` +
    `export const qrSize = ${SIZE};\nexport const qrPath =\n  "${d}";\n`,
);
console.log(`wrote ${out} (mask ${best})`);
