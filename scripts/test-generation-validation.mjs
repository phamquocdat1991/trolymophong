import assert from 'node:assert/strict';
import {test} from 'node:test';
import {TEXT_LIMITS} from '../lib/generation-limits.mjs';
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
    ['topic', 'x'.repeat(TEXT_LIMITS.topic+1), 'Chủ đề'],
    ['revision', 'x'.repeat(TEXT_LIMITS.revision+1), 'Yêu cầu chỉnh sửa'],
    ['details', 'x'.repeat(TEXT_LIMITS.details+1), 'Thông số'],
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

test('long Vietnamese descriptions and boundary inputs reach Gemini intact', async (t) => {
  const html = '<!doctype html><html><body>' + 'x'.repeat(200) + '<script>void 0;</script></body></html>';
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (_url, init) => {
    calls.push(JSON.parse(JSON.parse(init.body).contents[0].parts[0].text));
    return Response.json({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify({title:'Sự chuyển thể của nước',description:'Thí nghiệm',html})}]}}]});
  });
  const topic = 'Nước đá đang tan ở khoảng 0 °C.\nNước nóng dần rồi sôi ở 1 atm.\n'.repeat(100);
  for (const changes of [
    {topic},
    {topic:'x\n'.repeat(TEXT_LIMITS.topic/2),details:'x'.repeat(TEXT_LIMITS.details)},
    {action:'edit',revision:'x'.repeat(TEXT_LIMITS.revision),existingHtml:html},
  ]) {
    const response = await POST(request(changes));
    assert.equal(response.status, 200);
    const sent = calls.at(-1);
    for (const field of ['topic','details','revision']) {
      if (field in changes) assert.equal(sent[field], changes[field]);
    }
  }
});
