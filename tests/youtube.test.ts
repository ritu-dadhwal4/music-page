import test from 'node:test';
import assert from 'node:assert/strict';
import { extractVideoId, parseIsoDuration } from '../src/lib/youtube.ts';

const ID = 'dQw4w9WgXcQ';

test('accepts every URL shape the owner might paste', () => {
  for (const input of [
    `https://www.youtube.com/watch?v=${ID}`,
    `https://youtube.com/watch?v=${ID}`,
    `https://m.youtube.com/watch?v=${ID}`,
    `http://www.youtube.com/watch?v=${ID}`,
    `www.youtube.com/watch?v=${ID}`,
    `youtube.com/watch?v=${ID}`,
    `https://youtu.be/${ID}`,
    `https://youtube.com/shorts/${ID}`,
    `https://www.youtube.com/embed/${ID}`,
    `https://www.youtube.com/live/${ID}`,
    ID,
    `  ${ID}  `,
  ]) {
    assert.equal(extractVideoId(input), ID, `failed on ${input}`);
  }
});

test('ignores extra query params and fragments', () => {
  assert.equal(extractVideoId(`https://www.youtube.com/watch?v=${ID}&t=42s&list=PLxyz`), ID);
  assert.equal(extractVideoId(`https://youtu.be/${ID}?si=abc123&t=9`), ID);
  assert.equal(extractVideoId(`https://www.youtube.com/watch?app=desktop&v=${ID}`), ID);
});

test('rejects anything that is not a video link', () => {
  for (const input of [
    '', '   ', 'not a url', 'https://vimeo.com/12345',
    'https://www.youtube.com/watch?v=tooshort',
    'https://www.youtube.com/results?search_query=music',
    'https://example.com/watch?v=' + ID,
  ]) {
    assert.equal(extractVideoId(input), null, `should have rejected ${input}`);
  }
});

test('parses ISO 8601 durations into seconds', () => {
  assert.equal(parseIsoDuration('PT4M13S'), 253);
  assert.equal(parseIsoDuration('PT1H2M3S'), 3723);
  assert.equal(parseIsoDuration('PT45S'), 45);
  assert.equal(parseIsoDuration('PT3M'), 180);
  assert.equal(parseIsoDuration('P1DT2H'), 93600);
});

test('treats live streams and junk as unknown duration', () => {
  assert.equal(parseIsoDuration('PT0S'), null);
  assert.equal(parseIsoDuration(null), null);
  assert.equal(parseIsoDuration('garbage'), null);
});
