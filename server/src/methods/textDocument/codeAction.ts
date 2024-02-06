import { title } from "process";
import { DocumentUri, TextDocumentIdentifer } from "../../documents";
import { RequestMessage } from "../../server";
import { Range } from "../../types";
import { Diagnostic } from "./diagnostic";

interface CodeActionContext {
  diagnostics: Diagnostic[];
}

interface TextEdit {
  range: Range;
  newText: string;
}

interface WorkspaceEdit {
  changes: { [uri: DocumentUri]: TextEdit[] };
}

interface CodeActionParams {
  textDocument: TextDocumentIdentifer;
  range: Range;
  context: CodeActionContext;
}

interface codeAction {
  title: string;
  kind?: "quickfix";
  edit?: WorkspaceEdit;
  data?: unknown;
}

export const codeAction = (message: RequestMessage): codeAction[] | null => {
  const params = message.params as CodeActionParams;
  const diagnostics = params.context.diagnostics;

  return diagnostics.flatMap((diagnostic): codeAction[] => {
    return diagnostic.data.wordSuggessions.map((wordSuggestion): codeAction => {
      const codeAction: codeAction = {
        title: `Replace with ${wordSuggestion}`,
        kind: "quickfix",
        edit: {
          changes: {
            [params.textDocument.uri]: [
              {
                range: diagnostic.range,
                newText: wordSuggestion,
              },
            ],
          },
        },
      };
      return codeAction;
    });
  });
};
