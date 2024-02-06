import { RequestMessage } from "../../server";
import * as fs from "node:fs";
import { TextDocumentIdentifer, documents } from "../../documents";
import log from "../../log";
import { Position } from "../../types";

const words = fs.readFileSync("D:\\words.txt").toString().split("\n");

const MAX_LENGTH = 100;

interface TextDocumentPositionParams {
  textDocument: TextDocumentIdentifer;
  position: Position;
}

export interface CompletionPrams extends TextDocumentPositionParams {}

type CompletionItem = {
  label: string;
};

interface CompletionList {
  isIncomplete: boolean;
  items: CompletionItem[];
}

export const completion = (message: RequestMessage): CompletionList | null => {
  const params = message.params as CompletionPrams;
  const content = documents.get(params.textDocument.uri);
  if (!content) {
    return null;
  }
  const currentLine = content.split("\n")[params.position.line];
  const lineUntillCursor = currentLine.slice(0, params.position.character);
  const currentPrefix = lineUntillCursor.replace(/.*\W(.*?)/, "$1");

  log.write({
    completion: {
      currentLine,
      lineUntillCursor,
      currentPrefix,
    },
  });
  const items = words
    .filter((word) => word.startsWith(currentPrefix))
    .slice(0, MAX_LENGTH)
    .map((word) => {
      return { label: word };
    });
  return {
    isIncomplete: items.length === MAX_LENGTH,
    items,
  };
};
