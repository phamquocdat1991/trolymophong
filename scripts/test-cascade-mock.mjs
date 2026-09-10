#!/usr/bin/env node
/**
 * Kiểm thử giả lập (Mock Test) cơ chế Cascading Waterfall và Latency Timeout
 * Cho Gemini Resilience Gateway trong dự án trolymophong.
 * Chạy bằng: node scripts/test-cascade-mock.mjs
 */

import assert from 'node:assert/strict';
import {
  executeWithCascadeFallback,
  isFallbackEligibleError,
  buildDynamicWaterfall,
  DEFAULT_QUALITY_WATERFALL,
} from '../lib/gemini-resilience-gateway.ts';

class MockAiError extends Error {
  constructor(status, message) {
    super(`HTTP ${status}: ${message}`);
    this.status = status;
  }
}

async function runTests() {
  console.log('==========================================================');
  console.log('BẮT ĐẦU KIỂM THỬ GIẢ LẬP GEMINI RESILIENCE GATEWAY');
  console.log('==========================================================\n');

  // Test 0: Dynamic Waterfall Builder
  console.log('--- Test 0: buildDynamicWaterfall ---');
  const customWaterfall = buildDynamicWaterfall('gemini-2.5-flash');
  assert.equal(customWaterfall[0].model, 'gemini-2.5-flash');
  assert.ok(customWaterfall.some((c) => c.model === 'gemini-3.8-flash'));
  assert.equal(
    new Set(customWaterfall.map((c) => c.model)).size,
    customWaterfall.length,
    'Không được có model trùng lặp'
  );
  console.log('==> TEST 0 ĐẠT CHUẨN!\n');

  // Kịch bản 1: Model 3.8 bị nghẽn trễ (Latency Timeout) -> Fallback sang 3.7 thành công
  console.log('--- Kịch Bản 1: Model 3.8 bị nghẽn trễ (Latency Timeout) ---');
  const candidates1 = [
    { model: 'gemini-3.8-flash', timeoutMs: 150 },
    { model: 'gemini-3.7-flash', timeoutMs: 400 },
  ];
  const events1 = [];
  const res1 = await executeWithCascadeFallback(
    async ({ modelId, signal }) => {
      if (modelId === 'gemini-3.8-flash') {
        // Giả lập trễ 300ms > timeoutMs 150ms
        await new Promise((res, rej) => {
          const timer = setTimeout(res, 300);
          signal.addEventListener('abort', () => {
            clearTimeout(timer);
            const err = new Error('The operation was aborted');
            err.name = 'AbortError';
            rej(err);
          });
        });
      }
      return { html: '<div>Simulation 3.7</div>' };
    },
    {
      candidates: candidates1,
      apiKeys: ['TEST_KEY'],
      onFallback: (e) => events1.push(e),
    }
  );

  assert.equal(res1.usedModel, 'gemini-3.7-flash');
  assert.equal(events1.length, 1);
  assert.equal(events1[0].fromModel, 'gemini-3.8-flash');
  assert.equal(events1[0].toModel, 'gemini-3.7-flash');
  console.log(`   Đã tự động chuyển: ${events1[0].fromModel} ➔ ${events1[0].toModel} (${events1[0].reason})`);
  console.log('==> KỊCH BẢN 1 ĐẠT CHUẨN!\n');

  // Kịch bản 2: Model 3.8 bị lỗi HTTP 503 Overloaded -> Fallback sang 3.7 thành công
  console.log('--- Kịch Bản 2: Model 3.8 bị lỗi HTTP 503 Overloaded ---');
  const events2 = [];
  const res2 = await executeWithCascadeFallback(
    async ({ modelId }) => {
      if (modelId === 'gemini-3.8-flash') {
        throw new MockAiError(503, 'Model is overloaded. Please try again later.');
      }
      return { html: '<div>Simulation 3.7 (Recovered)</div>' };
    },
    {
      candidates: candidates1,
      apiKeys: ['TEST_KEY'],
      onFallback: (e) => events2.push(e),
    }
  );

  assert.equal(res2.usedModel, 'gemini-3.7-flash');
  assert.equal(events2.length, 1);
  assert.match(events2[0].reason, /503/);
  console.log(`   Đã tự động chuyển: ${events2[0].fromModel} ➔ ${events2[0].toModel} (${events2[0].reason})`);
  console.log('==> KỊCH BẢN 2 ĐẠT CHUẨN!\n');

  // Kịch bản 3: Cascade 2 bậc liên tiếp (3.8 bị 429 ➔ 3.7 bị 503 ➔ 3.6 thành công)
  console.log('--- Kịch Bản 3: Cascade 2 bậc liên tiếp (3.8 ➔ 3.7 ➔ 3.6) ---');
  const candidates3 = [
    { model: 'gemini-3.8-flash', timeoutMs: 500 },
    { model: 'gemini-3.7-flash', timeoutMs: 500 },
    { model: 'gemini-3.6-flash', timeoutMs: 500 },
  ];
  const events3 = [];
  const res3 = await executeWithCascadeFallback(
    async ({ modelId }) => {
      if (modelId === 'gemini-3.8-flash') throw new MockAiError(429, 'Rate limit exceeded');
      if (modelId === 'gemini-3.7-flash') throw new MockAiError(503, 'Service unavailable');
      return { html: '<div>Simulation 3.6 Flash Rock Solid</div>' };
    },
    {
      candidates: candidates3,
      apiKeys: ['TEST_KEY'],
      onFallback: (e) => events3.push(e),
    }
  );

  assert.equal(res3.usedModel, 'gemini-3.6-flash');
  assert.equal(events3.length, 2);
  console.log(`   Chuyển tầng 1: ${events3[0].fromModel} ➔ ${events3[0].toModel}`);
  console.log(`   Chuyển tầng 2: ${events3[1].fromModel} ➔ ${events3[1].toModel}`);
  console.log('==> KỊCH BẢN 3 ĐẠT CHUẨN!\n');

  // Kịch bản 4: Lỗi 400 Bad Request (Dừng ngay không chuyển)
  console.log('--- Kịch Bản 4: Lỗi 400 Bad Request (Dừng ngay không chuyển) ---');
  let stoppedImmediately = false;
  try {
    await executeWithCascadeFallback(
      async () => {
        throw new MockAiError(400, 'Invalid JSON schema argument');
      },
      {
        candidates: candidates3,
        apiKeys: ['TEST_KEY'],
      }
    );
  } catch (err) {
    stoppedImmediately = true;
    assert.equal(err.status, 400);
    console.log(`   Dừng ngay chuẩn xác với lỗi Fatal: ${err.message}`);
  }
  assert.ok(stoppedImmediately, 'Lỗi 400 bắt buộc phải ngắt dừng ngay!');
  console.log('==> KỊCH BẢN 4 ĐẠT CHUẨN!\n');

  // Kịch bản 5: Xoay vòng Key khi Quota cạn kiệt (Multi-Key Rotation)
  console.log('--- Kịch Bản 5: Xoay vòng Key khi Quota cạn kiệt ---');
  let attemptCount = 0;
  const res5 = await executeWithCascadeFallback(
    async ({ apiKey }) => {
      attemptCount++;
      if (apiKey === 'KEY_EXHAUSTED') {
        throw new Error('quota_exceeded: daily quota limit reached for project');
      }
      return { html: `<div>Success with Key: ${apiKey}</div>` };
    },
    {
      candidates: [{ model: 'gemini-3.8-flash', timeoutMs: 1000 }],
      apiKeys: ['KEY_EXHAUSTED', 'KEY_BACKUP_VALID'],
    }
  );

  assert.equal(res5.usedKeyIndex, 1);
  assert.equal(attemptCount, 2);
  console.log(`   Xoay vòng key thành công sang key index: ${res5.usedKeyIndex}`);
  console.log('==> KỊCH BẢN 5 ĐẠT CHUẨN!\n');

  console.log('==========================================================');
  console.log('TẤT CẢ 5 KỊCH BẢN KIỂM THỬ ĐỀU VƯỢT QUA 100% THÀNH CÔNG!');
  console.log('==========================================================');
}

runTests().catch((err) => {
  console.error('Kiểm thử thất bại:', err);
  process.exit(1);
});
