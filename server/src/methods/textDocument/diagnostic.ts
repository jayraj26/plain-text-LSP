import { RequestMessage } from "../../server";
import { Range, Position } from "../../types";
import log from "../../log";
import { TextDocumentIdentifer, documents } from "../../documents";
import { spellingSuggesions } from "../../spellingSuggesions";

namespace DiagnosticSeverity {
  export const Error: 1 = 1;
  export const Warning: 2 = 2;
  export const Information: 3 = 3;
  export const Hint: 4 = 4;
}

type DiagnosticSeverity = 1 | 2 | 3 | 4;

interface DocumentDiagnosticParams {
  textDocument: TextDocumentIdentifer;
}

interface SpellingSuggestionData {
  wordSuggessions: string[];
  type: "spelling-suggession";
}

export interface Diagnostic {
  range: Range;
  severity: DiagnosticSeverity;
  source: "LSP from scratch";
  message: string;
  data: SpellingSuggestionData;
}

export interface FullDocumentDiagnosticReport {
  kind: "full";
  items: Diagnostic[];
}

export const diagnostic = (
  message: RequestMessage
): FullDocumentDiagnosticReport | null => {
  const params = message.params as DocumentDiagnosticParams;
  const content = documents.get(params.textDocument.uri);
  if (!content) {
    return null;
  }

  const invalidWordsAndSuggessions: Record<string, string[]> =
    spellingSuggesions(content);

  log.write({ spellingSuggesions: invalidWordsAndSuggessions });

  const items: Diagnostic[] = [];
  const lines = content.split("\n");

  Object.keys(invalidWordsAndSuggessions).forEach((invalidword) => {
    const regexp = new RegExp(`\\b${invalidword}\\b`, "g");
    const wordSuggessions = invalidWordsAndSuggessions[invalidword];
    const message = wordSuggessions.length
      ? `${invalidword} is'nt in our dictionary. Did you mean ${wordSuggessions.join(
          ","
        )}`
      : `${invalidword} is'nt in our dictionary`;

    lines.forEach((line, lineNumber) => {
      let match;
      while ((match = regexp.exec(line)) !== null) {
        items.push({
          source: "LSP from scratch",
          severity: DiagnosticSeverity.Error,
          range: {
            start: { line: lineNumber, character: match.index },
            end: {
              line: lineNumber,
              character: match.index + invalidword.length,
            },
          },
          message,
          data: {
            wordSuggessions,
            type: "spelling-suggession",
          },
        });
      }
    });
  });

  return {
    kind: "full",
    items,
  };
};
