// extension.ts

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Register the command
    let disposable = vscode.commands.registerCommand('elixirFormat.formatFile', () => {
        // Get the currently active text editor
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            // Get the current file's URI
            const fileUri = editor.document.uri;

            // Check if the file is an Elixir file
            if (fileUri.fsPath.endsWith('.ex') || fileUri.fsPath.endsWith('.exs')) {
                // Run 'mix format' command
                vscode.window.terminals.forEach(terminal => terminal.dispose()); // Close existing terminals
                const terminal = vscode.window.createTerminal('Elixir Format');
                terminal.sendText(`mix format "${fileUri.fsPath}"`);
                terminal.show();
            } else {
                vscode.window.showInformationMessage('This command is only available for Elixir files (.ex, .exs).');
            }
        } else {
            vscode.window.showInformationMessage('Open an Elixir file to run mix format.');
        }
    });

    // Register the command to the context
    context.subscriptions.push(disposable);

    // Register the command to the context menu
    vscode.window.registerTreeDataProvider('elixirFormat.formatFile', {
        getTreeItem: (element) => {
            return element;
        },
        getChildren: () => [
            new vscode.TreeItem('Format Elixir File', vscode.TreeItemCollapsibleState.None),
        ],
    });

    vscode.commands.executeCommand('setContext', 'elixirFormat:enabled', true);
}

export function deactivate() {}
