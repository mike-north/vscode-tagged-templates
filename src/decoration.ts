import * as vscode from 'vscode'

export function createDecorationType(): vscode.TextEditorDecorationType {
	return vscode.window.createTextEditorDecorationType({
		backgroundColor: new vscode.ThemeColor('taggedTemplates.background'),
		border: '1px solid',
		borderColor: new vscode.ThemeColor('taggedTemplates.border'),
		rangeBehavior: vscode.DecorationRangeBehavior.ClosedOpen,
	})
}

export function applyDecorations(
	editor: vscode.TextEditor,
	decoration: vscode.TextEditorDecorationType,
	ranges: vscode.Range[],
): void {
	editor.setDecorations(decoration, ranges)
}

export function disposeDecorationType(decoration: vscode.TextEditorDecorationType): void {
	decoration.dispose()
}
