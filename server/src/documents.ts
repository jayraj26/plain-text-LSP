type DocumentBody = string;
export type DocumentUri = string;

export interface TextDocumentIdentifer {
  uri: DocumentUri;
}

export interface VersionedTextDocumentIdentifer extends TextDocumentIdentifer {
  version: number;
}

export interface TextDocumentContentChangeEvent {
  text: string;
}

export const documents = new Map<DocumentUri, DocumentBody>();
