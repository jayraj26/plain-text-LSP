import log from "./log";
import { initialize } from "./methods/initialize";
import { codeAction } from "./methods/textDocument/codeAction";
import { completion } from "./methods/textDocument/completion";
import { diagnostic } from "./methods/textDocument/diagnostic";
import { didChange } from "./methods/textDocument/didChange";

process.stdin.setEncoding("utf-8");

interface Message {
  jsonrpc: string;
}

export interface NotificationMessage extends Message {
  method: string;
  params?: unknown | object;
}

export interface RequestMessage extends NotificationMessage {
  id: Number | string;
}

type RequestMethod = (
  message: RequestMessage
) =>
  | ReturnType<typeof initialize>
  | ReturnType<typeof completion>
  | ReturnType<typeof diagnostic>
  | ReturnType<typeof codeAction>;

type NotificationMethod = (message: NotificationMessage) => void;

const methodLookup: Record<string, RequestMethod | NotificationMethod> = {
  initialize,
  "textDocument/completion": completion,
  "textDocument/didChange": didChange,
  "textDocument/diagnostic": diagnostic,
  "textDocument/codeAction": codeAction,
};
const respond = (id: RequestMessage["id"], result: object | null) => {
  const message = JSON.stringify({ id, result });
  const messageLength = Buffer.byteLength(message, "utf-8");
  const header = `Content-Length: ${messageLength}\r\n\r\n`;

  log.write(header + message);
  process.stdout.write(header + message);
};

let buffer = "";
process.stdin.on("data", (data) => {
  buffer += data;
  while (true) {
    const lengthmatch = buffer.match(/Content-Length: (\d+)\r\n/);
    if (!lengthmatch) break;

    const contentLength = parseInt(lengthmatch[1], 10);
    const messageStart = buffer.indexOf("\r\n\r\n") + 4;

    if (buffer.length < messageStart + contentLength) break;

    const rawMesage = buffer.slice(messageStart, messageStart + contentLength);
    const message = JSON.parse(rawMesage);
    log.write({ id: message.id, method: message.method });
    const method = methodLookup[message.method];
    if (method) {
      const result = method(message);
      if (result !== undefined) {
        respond(message.id, result);
      }
    }
    buffer = buffer.slice(messageStart + contentLength);
  }
});
