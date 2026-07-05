/**
 * @fileoverview Core service registrations.
 */
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { GitHubProvider } from '@/services/github/github-provider.js';

export function registerCoreServices(): void {
  container.registerSingleton<GitHubProvider>(
    GitHubProviderToken as unknown as string,
    GitHubProvider,
  );
}
