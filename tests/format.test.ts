import test from 'node:test';
import assert from 'node:assert/strict';
import { formatTime } from '../src/lib/format.ts';

test('formats seconds as m:ss', () => {
  assert.equal(formatTime(0), '0:00');
  assert.equal(formatTime(28), '0:28');
  assert.equal(formatTime(212), '3:32');
  assert.equal(formatTime(3674), '61:14');
});

test('unknown durations render as dashes, not 0:00', () => {
  assert.equal(formatTime(null), '--:--');
  assert.equal(formatTime(undefined), '--:--');
  assert.equal(formatTime(Number.NaN), '--:--');
  assert.equal(formatTime(-1), '--:--');
});
