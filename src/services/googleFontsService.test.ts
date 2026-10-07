import test from 'node:test';
import assert from 'node:assert/strict';
import { buildGoogleFontUrl, loadGoogleFont, parseVariant } from './googleFontsService';
import type { GoogleFont } from '../types/font';

const font: GoogleFont = { family: 'Test Font', category: 'sans-serif', variants: ['regular', '700', 'italic'], subsets: ['latin'] };

test('static URL requests only supported styles in sorted order', () => {
  assert.equal(buildGoogleFontUrl(font), 'https://fonts.googleapis.com/css2?family=Test+Font:ital,wght@0,400;0,700;1,400&display=swap');
  assert.equal(parseVariant('700italic').weight, 700);
});

test('variable URL includes every axis with sorted tuples', () => {
  const variable = { ...font, isVariable: true, axes: [
    { tag: 'wght', min: 100, max: 900, default: 400, name: 'Weight' },
    { tag: 'wdth', min: 75, max: 100, default: 100, name: 'Width' },
  ] };
  assert.match(buildGoogleFontUrl(variable), /:ital,wdth,wght@0,75\.\.100,100\.\.900;1,75\.\.100,100\.\.900/);
});

test('loader shares pending requests and retries after a stylesheet error', async () => {
  const links: any[] = [];
  const previous = globalThis.document;
  globalThis.document = {
    createElement: () => ({ removed: false, remove() { this.removed = true; } }),
    head: { appendChild: (link: any) => links.push(link) },
    fonts: { load: async () => [{}] },
  } as any;
  try {
    const first = loadGoogleFont(font);
    assert.equal(loadGoogleFont(font), first);
    links[0].onerror();
    assert.equal(await first, false);
    assert.equal(links[0].removed, true);
    const retry = loadGoogleFont(font);
    assert.equal(links.length, 2);
    await links[1].onload();
    assert.equal(await retry, true);
  } finally { globalThis.document = previous; }
});

test('an empty font-face result is an error, not a successful preview', async () => {
  const previous = globalThis.document;
  let link: any;
  globalThis.document = {
    createElement: () => ({ remove() {} }),
    head: { appendChild: (element: any) => { link = element; } },
    fonts: { load: async () => [] },
  } as any;
  try {
    const result = loadGoogleFont({ ...font, family: 'Missing Font' });
    await link.onload();
    assert.equal(await result, false);
  } finally { globalThis.document = previous; }
});
