# Plain text LSP

This is a Language Server Protocol (LSP) tailored for Visual Studio Code, optimized for handling English text. It facilitates seamless integration of advanced language-specific functionalities within the editor environment..

## Features

- **Code Completion**: LSP offers intelligent code completion suggestions as you type, helping you write code faster and with fewer errors by predicting the contextually relevant code snippets or identifiers.
- **Error Checking and Diagnostics**: LSP performs real-time error checking and provides diagnostics, highlighting potential issues such as syntax errors, type mismatches, or unused variables, helping you catch and fix errors early in the development process.Drag and
- **Hover Information**: LSP allows you to hover over symbols or expressions to get quick contextual information, such as function signatures, variable types, or documentation comments, aiding in understanding and navigating codebases.

# Installation

LSP requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
cd LSP
npm i
```

It also uses [Aspell](http://aspell.net/) for spellcheck.Download [Aspell](http://aspell.net/win32/) depending on your operating system and add aspell and its bin path to the system variables if using windows, then check
if it is installed correctly.

```sh
echo Hello | aspell -a
@(#) International Ispell Version 3.1.20 (but really Aspell 0.50.3)
*
```

if you get this after runnning aspell then it is downloded and configured correctly.

# Run

Open the project:

```sh
cd LSP
```

go to

```sh
server > src > methods > textDocument > completion.ts
```

and replace the path inside `fs.readFileSync` to the file path in your development enviourment

```sh
const words = fs.readFileSync("D:\\words.txt").toString().split("\n");
```

Start debugging by opening it from sidebar or with keyboard shortcut:

```sh
ctrl + shift + b
```

Then, in run and debug sidebar from the dropdown select "Launch Client"
A new VS code window opens open a text file and start typing and expirience the
LSP.

#References

|     | Name                             | Link                                                                                        |
| --- | -------------------------------- | ------------------------------------------------------------------------------------------- |
| 1   | Vs code language spedification   | https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/ |
| 2   | Language Server Extension Guide  | https://code.visualstudio.com/api/language-extensions/language-server-extension-guide       |
| 3   | Language server-node github repo | https://github.com/Microsoft/vscode-languageserver-node                                     |

# License

MIT

**Free Software, Hell Yeah!**
