// https://docs.pinecone.io/platform/endpoints/
export type PineconeChatModelId =
  | 'Pinecone'
  | (string & {});

export interface PineconeChatSettings {
  /**
Whether to inject a safety prompt before all conversations.

Defaults to `false`.
   */
  safePrompt?: boolean;
}
