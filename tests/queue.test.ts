import test from 'node:test';
import assert from 'node:assert/strict';
import { pickNextIndex } from '../src/player/queue.ts';
import type { Track } from '../src/lib/types.ts';

const tracks: Track[] = ['a', 'b', 'c'].map((id) => ({
  id, youtubeId: 'aaaaaaaaaaa', title: id, artist: '', thumbnail: 'https://x/y.jpg', duration: null,
}));

const at = (o: Partial<Parameters<typeof pickNextIndex>[0]> = {}) =>
  pickNextIndex({
    tracks, fromIndex: 0, shuffle: false, repeat: false,
    isAutoAdvance: true, played: new Set(), random: () => 0, ...o,
  });

test('sequential play advances one track', () => {
  assert.equal(at({ fromIndex: 0 }), 1);
  assert.equal(at({ fromIndex: 1 }), 2);
});

test('end of list stops when repeat is off', () => {
  assert.equal(at({ fromIndex: 2 }), null);
});

test('end of list wraps when repeat is on', () => {
  assert.equal(at({ fromIndex: 2, repeat: true }), 0);
});

test('pressing next at the end wraps even without repeat', () => {
  assert.equal(at({ fromIndex: 2, isAutoAdvance: false }), 0);
});

test('shuffle never returns the current track', () => {
  for (let i = 0; i < 50; i += 1) {
    assert.notEqual(at({ fromIndex: 1, shuffle: true, random: Math.random }), 1);
  }
});

test('shuffle skips tracks already played this cycle', () => {
  // 'b' is spent, so from 'a' the only candidate left is 'c'.
  assert.equal(at({ fromIndex: 0, shuffle: true, played: new Set(['b']) }), 2);
});

test('shuffle stops at the end of a cycle when repeat is off', () => {
  assert.equal(at({ fromIndex: 0, shuffle: true, played: new Set(['b', 'c']) }), null);
});

test('shuffle starts a fresh cycle when repeat is on', () => {
  const played = new Set(['b', 'c']);
  const next = at({ fromIndex: 0, shuffle: true, repeat: true, played });
  assert.notEqual(next, null);
  assert.notEqual(next, 0);
  assert.equal(played.size, 0, 'the exhausted cycle should have been cleared');
});

test('a single track stops on auto-advance but repeats on demand', () => {
  const one = tracks.slice(0, 1);
  assert.equal(at({ tracks: one, fromIndex: 0 }), null);
  assert.equal(at({ tracks: one, fromIndex: 0, repeat: true }), 0);
  assert.equal(at({ tracks: one, fromIndex: 0, isAutoAdvance: false }), 0);
});

test('an empty queue has nothing to play', () => {
  assert.equal(at({ tracks: [] }), null);
});
