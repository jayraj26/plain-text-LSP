import {
  documents,
  VersionedTextDocumentIdentifer,
  TextDocumentContentChangeEvent,
} from "../../documents";
import log from "../../log";
import { NotificationMessage } from "../../server";

interface DIdChangeTextDocumentParams {
  textDocument: VersionedTextDocumentIdentifer;
  contentChanges: TextDocumentContentChangeEvent[];
}

export const didChange = (message: NotificationMessage): void => {
  const params = message.params as DIdChangeTextDocumentParams;
  documents.set(params.textDocument.uri, params.contentChanges[0].text);
};
