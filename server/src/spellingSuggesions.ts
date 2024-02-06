import { spawnSync } from "child_process";
import log from "./log";

export const spellingSuggesions = (
  content: string
): Record<string, string[]> => {
  const invalidWordsAndSuggestions: Record<string, string[]> = {};
  const allOutput = spawnSync("aspell", ["pipe"], {
    input: content,
    encoding: "utf-8",
  })
    .stdout.trim()
    .split("\r\n");

  log.write({ allOutput });

  allOutput.forEach((line) => {
    log.write({ line });
    const prefix = line.slice(0, 1);
    log.write({ prefix });
    switch (prefix) {
      case "&":
        const suggestionMatch = line.match(/^& (.*?) \d.*: (.*)$/);

        if (!suggestionMatch) {
          log.write({ spellingSuggestions: { invalidMatch: line } });
          return;
        }

        invalidWordsAndSuggestions[suggestionMatch[1]] =
          suggestionMatch[2].split(", ");
        break;
      case "#":
        const match = line.match(/^# (.*?) \d/);

        if (!match) {
          log.write({ spellingSuggestions: { invalidMatch: line } });
          return;
        }

        invalidWordsAndSuggestions[match[1]] = [];
        break;
    }
  });

  return invalidWordsAndSuggestions;
};
