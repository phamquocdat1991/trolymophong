import assert from 'node:assert/strict';
import {test} from 'node:test';
import {POST} from '../app/api/generate/route.ts';

const base = {
  key: 'TEST_ONLY_NOT_A_REAL_KEY', model: 'gemini-2.5-flash',
  topic: 'phản ứng giữa dd cuso4 và dd naoh', subject: 'Hóa học',
  grade: 'Lớp 8', details: '', devices: 'Máy chiếu + Laptop',
};
function request(changes = {}) {
  const form = new FormData();
  for (const [name, value] of Object.entries({...base, ...changes})) form.set(name, value);
  return new Request('https://example.test/api/generate', {method: 'POST', body: form});
}

test('invalid input identifies the affected field without exposing submitted values', async () => {
  for (const [field, value, label] of [
    ['model', 'private-invalid-model', 'Model'],
    ['topic', 'x'.repeat(3001), 'Chủ đề'],
    ['details', 'x'.repeat(2001), 'Thông số'],
    ['key', 'SENSITIVE_' + 'x'.repeat(301), 'API Key'],
    ['subject', '', 'Môn học'],
  ]) {
    const response = await POST(request({[field]: value}));
    assert.equal(response.status, 400);
    const body = await response.json();
    assert.ok(body.error.includes(label), `Missing actionable field label for ${field}`);
    assert.equal(JSON.stringify(body).includes(base.key), false);
    if (value) assert.equal(JSON.stringify(body).includes(value), false);
  }
});

test('new simulation accepts the reported topic without revision fields', async (t) => {
  // Only the external Google request is replaced; request parsing and response handling are real.
  t.mock.method(globalThis, 'fetch', async () => new Response('denied', {status: 403}));
  const response = await POST(request());
  assert.equal(response.status, 502);
  assert.match((await response.json()).error, /API Key/);
});
