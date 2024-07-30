import { loadApiKey, withoutTrailingSlash } from '@ai-sdk/provider-utils';
import { PineconeChatLanguageModel } from './pinecone-chat-language-model';
import {
  PineconeChatModelId,
  PineconeChatSettings,
} from './pinecone-chat-settings';
import { PineconeProviderSettings } from './pinecone-provider';

/**
 * @deprecated Use `createPinecone` instead.
 */
export class Pinecone {
  /**
   * Base URL for the Pinecone API calls.
   */
  readonly baseURL: string;

  readonly apiKey?: string;

  readonly headers?: Record<string, string>;

  /**
   * Creates a new Pinecone provider instance.
   */
  constructor(options: PineconeProviderSettings = {}) {
    this.baseURL =
      withoutTrailingSlash(options.baseURL ?? options.baseUrl) ??
      `https://prod-1-data.ke.pinecone.io/assistant/chat/${ASSISTANT_NAME}/chat/completions`

    this.apiKey = options.apiKey;
    this.headers = options.headers;
  }

  private get baseConfig() {
    return {
      baseURL: this.baseURL,
      headers: () => ({
        Authorization: `Bearer ${loadApiKey({
          apiKey: this.apiKey,
          environmentVariableName: 'PINECONE_API_KEY',
          description: 'Pinecone',
        })}`,
        ...this.headers,
      }),
    };
  }

  chat(modelId: PineconeChatModelId, settings: PineconeChatSettings = {}) {
    return new PineconeChatLanguageModel(modelId, settings, {
      provider: 'pinecone.chat',
      ...this.baseConfig,
    });
  }
}
