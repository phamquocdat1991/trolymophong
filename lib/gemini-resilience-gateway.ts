/**
 * Gemini Resilience Gateway
 * Module điều phối Gemini API bậc thang (Cascading Model Fallback)
 * và ngắt độ trễ thông minh (Latency Timeout) cho ứng dụng giáo dục.
 */

export interface ModelCandidate {
  model: string;
  timeoutMs: number;
  label?: string;
}

/**
 * Profile A: Chất Lượng Sư Phạm & Suy Luận Cao (Quality & Reasoning Profile)
 * Phù hợp với tác vụ tạo bài mô phỏng HTML tương tác có Canvas/SVG, công thức và bài học.
 */
export const DEFAULT_QUALITY_WATERFALL: readonly ModelCandidate[] = [
  { model: 'gemini-3.8-flash', timeoutMs: 25000, label: 'Gemini 3.8 Flash (Chính)' },
  { model: 'gemini-3.7-flash', timeoutMs: 20000, label: 'Gemini 3.7 Flash (Dự phòng 1)' },
  { model: 'gemini-3.6-flash', timeoutMs: 20000, label: 'Gemini 3.6 Flash (Dự phòng 2)' },
  { model: 'gemini-3.5-flash-lite', timeoutMs: 15000, label: 'Gemini 3.5 Flash-Lite (Cứu hộ)' },
] as const;

/**
 * Profile B: Tốc Độ & Kinh Tế (Economy Profile)
 */
export const ECONOMY_WATERFALL: readonly ModelCandidate[] = [
  { model: 'gemini-3.5-flash-lite', timeoutMs: 8000, label: 'Gemini 3.5 Flash-Lite' },
  { model: 'gemini-3.1-flash-lite', timeoutMs: 8000, label: 'Gemini 3.1 Flash-Lite' },
  { model: 'gemini-2.5-flash-lite', timeoutMs: 8000, label: 'Gemini 2.5 Flash-Lite' },
] as const;

export interface FallbackEvent {
  fromModel: string;
  toModel: string;
  reason: string;
  elapsedMs: number;
}

export interface GatewayConfig {
  candidates?: ModelCandidate[];
  apiKeys?: string[];
  maxRetriesPerModel?: number;
  totalDeadlineMs?: number;
  onFallback?: (event: FallbackEvent) => void;
}

export interface CallResult<T> {
  data: T;
  usedModel: string;
  usedKeyIndex: number;
  attempts: number;
  durationMs: number;
  fallbacks: FallbackEvent[];
}

export interface ErrorEvaluation {
  canFallback: boolean;
  reason: string;
  isKeyRotationEligible?: boolean;
}

/**
 * Tự động tạo chuỗi bậc thang dựa trên model do người dùng/giáo viên lựa chọn.
 * Model được chọn sẽ nằm ở vị trí Tầng 1, các model dự phòng chuẩn mực sẽ tiếp nối.
 */
export function buildDynamicWaterfall(
  primaryModel?: string,
  baseWaterfall: readonly ModelCandidate[] = DEFAULT_QUALITY_WATERFALL
): ModelCandidate[] {
  if (!primaryModel || !primaryModel.trim()) {
    return [...baseWaterfall];
  }

  const primaryClean = primaryModel.trim();
  const existing = baseWaterfall.find((c) => c.model === primaryClean);

  const primaryCandidate: ModelCandidate = existing
    ? { ...existing, label: `${existing.label || existing.model} (Ưu tiên)` }
    : {
        model: primaryClean,
        timeoutMs: 25000,
        label: `${primaryClean} (Người dùng chọn)`,
      };

  const fallbacks = baseWaterfall.filter((c) => c.model !== primaryClean);
  return [primaryCandidate, ...fallbacks];
}

/**
 * Phân loại lỗi trả về từ Gemini API hoặc mạng
 */
export function isFallbackEligibleError(error: any): ErrorEvaluation {
  if (!error) return { canFallback: false, reason: 'Lỗi không xác định' };

  // 1. Lỗi quá thời gian chờ (Latency Timeout / AbortSignal)
  if (
    error.name === 'AbortError' ||
    error.name === 'TimeoutError' ||
    error.message?.includes('aborted') ||
    error.message?.includes('timed out') ||
    error.message?.toLowerCase().includes('timeout')
  ) {
    return { canFallback: true, reason: 'Quá thời gian phản hồi quy định (Latency Timeout)' };
  }

  const status = error.status ?? error.statusCode ?? error.response?.status;
  const message = (error.message || '').toLowerCase();

  // 2. Hết hạn mức dự án (Quota Exhausted -> Xoay vòng Key)
  if (
    message.includes('quota_exceeded') ||
    message.includes('daily quota') ||
    message.includes('check your plan and billing details')
  ) {
    return {
      canFallback: true,
      reason: 'Hết hạn mức Quota trong ngày của API Key',
      isKeyRotationEligible: true,
    };
  }

  // 3. HTTP 429 Rate Limit (RPM / TPM)
  if (status === 429 || message.includes('resource_exhausted') || message.includes('rate limit')) {
    return { canFallback: true, reason: 'Quá tải hạn mức truy cập tạm thời (HTTP 429 Rate Limit)' };
  }

  // 4. HTTP 503 / 502 / 500 / Overloaded
  if (
    status === 503 ||
    status === 502 ||
    status === 500 ||
    message.includes('overloaded') ||
    message.includes('service unavailable') ||
    message.includes('internal error')
  ) {
    return { canFallback: true, reason: 'Cụm máy chủ Gemini tạm thời quá tải (HTTP 503/500 Overloaded)' };
  }

  // 5. HTTP 504 Deadline Exceeded
  if (status === 504 || message.includes('deadline_exceeded')) {
    return { canFallback: true, reason: 'Cổng Google quá hạn phản hồi (HTTP 504 Deadline Exceeded)' };
  }

  // 6. HTTP 404 Model Not Found / Deprecated
  if (status === 404 || message.includes('not found') || message.includes('is not supported')) {
    return { canFallback: true, reason: 'Model không khả dụng hoặc đã ngừng hỗ trợ (HTTP 404)' };
  }

  // 7. Lỗi dừng ngay (Fatal)
  if (status === 400 || message.includes('invalid_argument')) {
    return { canFallback: false, reason: 'Tham số hoặc cấu trúc yêu cầu không hợp lệ (HTTP 400)' };
  }
  if (status === 403 || message.includes('permission_denied')) {
    return { canFallback: false, reason: 'API Key bị từ chối quyền truy cập (HTTP 403)' };
  }

  return { canFallback: false, reason: `Lỗi không chuyển tầng: ${error.message || status}` };
}

/**
 * Thực thi gọi AI với cơ chế Cascading Waterfall & Latency Timeout
 */
export async function executeWithCascadeFallback<T>(
  action: (context: { apiKey: string; modelId: string; signal: AbortSignal }) => Promise<T>,
  config: GatewayConfig = {}
): Promise<CallResult<T>> {
  const candidates = config.candidates && config.candidates.length > 0 ? config.candidates : [...DEFAULT_QUALITY_WATERFALL];
  const rawKeys = config.apiKeys && config.apiKeys.length > 0 ? config.apiKeys : [process.env.GEMINI_API_KEY || ''];
  const apiKeys = rawKeys.map((k) => k.trim()).filter(Boolean);

  if (apiKeys.length === 0) {
    throw new Error('Không có API Key hợp lệ để kết nối Gemini API.');
  }

  const maxRetriesPerModel = config.maxRetriesPerModel ?? 0;
  const totalDeadlineMs = config.totalDeadlineMs ?? 60000;

  const startTime = Date.now();
  const fallbacks: FallbackEvent[] = [];
  let keyIndex = 0;
  let totalAttempts = 0;
  let lastError: any = null;

  for (let modelIdx = 0; modelIdx < candidates.length; modelIdx++) {
    const candidate = candidates[modelIdx];

    for (let retry = 0; retry <= maxRetriesPerModel; retry++) {
      totalAttempts++;

      const currentElapsed = Date.now() - startTime;
      if (currentElapsed >= totalDeadlineMs) {
        throw new Error(
          `Vượt quá giới hạn thời gian tổng thể (${Math.round(totalDeadlineMs / 1000)}s). Thao tác được dừng an toàn.`
        );
      }

      const activeApiKey = apiKeys[keyIndex];
      const remainingTotal = totalDeadlineMs - currentElapsed;
      const attemptTimeout = Math.min(candidate.timeoutMs, remainingTotal);

      const controller = new AbortController();
      const timeoutHandle = setTimeout(() => {
        controller.abort(new Error(`Timeout sau ${attemptTimeout}ms tại model ${candidate.model}`));
      }, attemptTimeout);

      try {
        const result = await action({
          apiKey: activeApiKey,
          modelId: candidate.model,
          signal: controller.signal,
        });

        clearTimeout(timeoutHandle);

        return {
          data: result,
          usedModel: candidate.model,
          usedKeyIndex: keyIndex,
          attempts: totalAttempts,
          durationMs: Date.now() - startTime,
          fallbacks,
        };
      } catch (err: any) {
        clearTimeout(timeoutHandle);
        lastError = err;

        const evaluation = isFallbackEligibleError(err);

        // Trường hợp hết Quota ngày và có key dự phòng
        if (evaluation.isKeyRotationEligible && keyIndex + 1 < apiKeys.length) {
          keyIndex++;
          retry--;
          console.warn(`[Gemini Gateway] Quota key hiện tại cạn kiệt, tự động chuyển sang Key dự phòng #${keyIndex + 1}`);
          continue;
        }

        // Nếu lỗi Fatal (ví dụ 400 Bad Request) thì dừng ngay lập tức
        if (!evaluation.canFallback) {
          throw err;
        }

        const isLastModel = modelIdx === candidates.length - 1;
        const isLastRetry = retry === maxRetriesPerModel;

        if (!isLastModel && isLastRetry) {
          const nextCandidate = candidates[modelIdx + 1];
          const fallbackEvent: FallbackEvent = {
            fromModel: candidate.model,
            toModel: nextCandidate.model,
            reason: evaluation.reason,
            elapsedMs: Date.now() - startTime,
          };
          fallbacks.push(fallbackEvent);

          if (config.onFallback) {
            config.onFallback(fallbackEvent);
          }

          console.warn(
            `[Gemini Gateway] [${fallbackEvent.elapsedMs}ms] Chuyển từ ${candidate.model} ➔ ${nextCandidate.model}. Lý do: ${evaluation.reason}`
          );
          break; // Sang model tiếp theo trong vòng lặp ngoài
        } else if (!isLastRetry) {
          // Backoff jitter trước khi thử lại cùng model
          await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));
        }
      }
    }
  }

  throw lastError || new Error('Tất cả các mô hình trong chuỗi bậc thang đều không phản hồi thành công.');
}
