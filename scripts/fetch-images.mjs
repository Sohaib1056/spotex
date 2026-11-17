// One-off: copies every product photo (and the logo) referenced in src/data/products.ts
// from the old site into public/, so the new site serves its own images.
// Usage: node scripts/fetch-images.mjs
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OLD = 'https://spotexint.com/uploads/products/';
const data = await readFile(join(root, 'src/data/products.ts'), 'utf8');
const files = [...new Set([...data.matchAll(/(?:https:\/\/spotexint\.com\/uploads)?\/products\/([\w.-]+\.webp)/g)].map((m) => m[1]))];

const jobs = [
  ...files.map((f) => ({ url: OLD + f, to: join(root, 'public/products', f) })),
  { url: 'https://spotexint.com/build/assets/logo-7a263721.webp', to: join(root, 'public/brand/logo.webp') },
];

const exists = (p) => stat(p).then(() => true, () => false);
let done = 0;
let failed = 0;
for (const job of jobs) {
  if (await exists(job.to)) { done++; continue; }
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(job.url, { signal: AbortSignal.timeout(60_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await mkdir(dirname(job.to), { recursive: true });
      await writeFile(job.to, Buffer.from(await res.arrayBuffer()));
      done++;
      break;
    } catch (err) {
      if (attempt === 3) { failed++; console.error('FAILED', job.url, err.message); }
    }
  }
}
console.log(`images: ${done} saved, ${failed} failed, ${jobs.length} total`);
