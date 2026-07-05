import { vi } from 'vitest';

import type { RequestContext } from '@/utils/index.js';
import type { SdkContext } from '@/mcp-server/tools/utils/toolDefinition.js';

export function createTestContext(opts: { tenantId?: string } = {}): RequestContext {
  return {
    requestId: `test-req-${Date.now()}`,
    sessionId: 'test-session',
    tenantId: opts.tenantId || 'test-tenant',
    operation: 'test',
  };
}

export function createTestSdkContext(): SdkContext {
  return {
    signal: new AbortController().signal,
    sendNotification: vi.fn() as any,
    sendRequest: vi.fn() as any,
    authInfo: undefined,
    requestId: 'test-sdk-req',
    sessionId: 'test-sdk-session',
  } as unknown as SdkContext;
}
