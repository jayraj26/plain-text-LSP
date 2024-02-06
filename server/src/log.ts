import * as fs from "node:fs";

const log = fs.createWriteStream("../../../lsp.log");

export default {
  write: (message: object | unknown) => {
    if (typeof message === "object") {
      log.write(JSON.stringify(message));
    } else {
      log.write(message);
    }
    log.write("\n");
  },
};
