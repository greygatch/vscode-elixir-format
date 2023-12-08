// extension.ts

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Register the 'Format Elixir File' command
    let formatDisposable = vscode.commands.registerCommand('elixirFormat.formatFile', () => {
        runMixFormat();
    });

    // Register the 'Run Elixir Test' command
    let testDisposable = vscode.commands.registerCommand('elixirFormat.runTest', () => {
        runElixirTest();
    });

    // Add both commands to the context subscriptions
    context.subscriptions.push(formatDisposable, testDisposable);

    // Register the 'Format Elixir File' command to the context menu
    vscode.window.registerTreeDataProvider('elixirFormat.formatFile', {
        provideTreeData: () => [
            new vscode.TreeItem('Format Elixir File', vscode.TreeItemCollapsibleState.None),
        ],
    });

    // Register the 'Run Elixir Test' command to the context menu
    vscode.window.registerTreeDataProvider('elixirFormat.runTest', {
        provideTreeData: () => [
            new vscode.TreeItem('Run Elixir Test', vscode.TreeItemCollapsibleState.None),
        ],
    });

    vscode.commands.executeCommand('setContext', 'elixirFormat:enabled', true);
}

function runMixFormat() {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        const fileUri = editor.document.uri;

        if (fileUri.fsPath.endsWith('.ex') || fileUri.fsPath.endsWith('.exs')) {
            vscode.window.terminals.forEach(terminal => terminal.dispose());
            const terminal = vscode.window.createTerminal('Elixir Format');
            terminal.sendText(`mix format "${fileUri.fsPath}"`);
            terminal.show();
        } else {
            vscode.window.showInformationMessage('This command is only available for Elixir files (.ex, .exs).');
        }
    } else {
        vscode.window.showInformationMessage('Open an Elixir file to run mix format.');
    }
}

function runElixirTest() {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        const fileUri = editor.document.uri;

        if (fileUri.fsPath.endsWith('_test.exs')) {
            vscode.window.terminals.forEach(terminal => terminal.dispose());
            const terminal = vscode.window.createTerminal('Elixir Test');
            terminal.sendText(`mix test "${fileUri.fsPath}"`);
            terminal.show();
        } else {
            vscode.window.showInformationMessage('This command is only available for Elixir test files (_test.exs).');
        }
    } else {
        vscode.window.showInformationMessage('Open an Elixir test file to run the test.');
    }
}

export function deactivate() {}
