import { loadApiKey, withoutTrailingSlash } from '@ai-sdk/provider-utils';
import { PineconeChatLanguageModel } from './pinecone-chat-language-model';
import {
  PineconeChatModelId,
  PineconeChatSettings,
} from './pinecone-chat-settings';
import { PineconeEmbeddingModel } from './pinecone-embedding-model';
import {
  PineconeEmbeddingModelId,
  PineconeEmbeddingSettings,
} from './pinecone-embedding-settings';

export interface PineconeProvider {
  (
    modelId: PineconeChatModelId,
    settings?: PineconeChatSettings,
  ): PineconeChatLanguageModel;

  /**
Creates a model for text generation.
*/
  languageModel(
    modelId: PineconeChatModelId,
    settings?: PineconeChatSettings,
  ): PineconeChatLanguageModel;

  /**
Creates a model for text generation.
*/
  chat(
    modelId: PineconeChatModelId,
    settings?: PineconeChatSettings,
  ): PineconeChatLanguageModel;

  /**
Creates a model for text embeddings.
   */
  embedding(
    modelId: PineconeEmbeddingModelId,
    settings?: PineconeEmbeddingSettings,
  ): PineconeEmbeddingModel;

  /**
Creates a model for text embeddings.
   */
  textEmbedding(
    modelId: PineconeEmbeddingModelId,
    settings?: PineconeEmbeddingSettings,
  ): PineconeEmbeddingModel;
}

export interface PineconeProviderSettings {
  /**
Use a different URL prefix for API calls, e.g. to use proxy servers.
The default prefix is `https://api.pinecone.io/v1`.
   */
  baseURL?: string;

  /**
@deprecated Use `baseURL` instead.
   */
  baseUrl?: string;

  /**
API key that is being send using the `Authorization` header.
It defaults to the `PINECONE_API_KEY` environment variable.
   */
  apiKey?: string;

  /**
Custom headers to include in the requests.
     */
  headers?: Record<string, string>;

  /**
Custom fetch implementation. You can use it as a middleware to intercept requests,
or to provide a custom fetch implementation for e.g. testing.
    */
  fetch?: typeof fetch;
}

/**
Create a Pinecone AI provider instance.
 */
export function createPinecone(
  options: PineconeProviderSettings = {},
): PineconeProvider {
  const baseURL =
    withoutTrailingSlash(options.baseURL ?? options.baseUrl) ??
    'https://api.pinecone.io/v1';

  const getHeaders = () => ({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: 'PINECONE_API_KEY',
      description: 'Pinecone',
    })}`,
    ...options.headers,
  });

  const createChatModel = (
    modelId: PineconeChatModelId,
    settings: PineconeChatSettings = {},
  ) =>
    new PineconeChatLanguageModel(modelId, settings, {
      provider: 'pinecone.chat',
      baseURL,
      headers: getHeaders,
      fetch: options.fetch,
    });

  const createEmbeddingModel = (
    modelId: PineconeEmbeddingModelId,
    settings: PineconeEmbeddingSettings = {},
  ) =>
    new PineconeEmbeddingModel(modelId, settings, {
      provider: 'pinecone.embedding',
      baseURL,
      headers: getHeaders,
      fetch: options.fetch,
    });

  const provider = function (
    modelId: PineconeChatModelId,
    settings?: PineconeChatSettings,
  ) {
    if (new.target) {
      throw new Error(
        'The Pinecone model function cannot be called with the new keyword.',
      );
    }

    return createChatModel(modelId, settings);
  };

  provider.languageModel = createChatModel;
  provider.chat = createChatModel;
  provider.embedding = createEmbeddingModel;
  provider.textEmbedding = createEmbeddingModel;

  return provider as PineconeProvider;
}

/**
Default Pinecone provider instance.
 */
export const pinecone = createPinecone();
