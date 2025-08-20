import * as vscode from 'vscode'
import { computeTaggedTemplateRanges } from './src/ranges.js'
import { applyDecorations, disposeAllDecorationTypes } from './src/decoration.js'
import { isExtensionEnabled } from './src/config'

let debounceTimer: NodeJS.Timeout | undefined

export function activate(ctx: vscode.ExtensionContext) {
	function refresh(editor?: vscode.TextEditor) {
		const activeEditor = editor ?? vscode.window.activeTextEditor
		if (!activeEditor) return
		if (!isExtensionEnabled()) {
			applyDecorations(activeEditor, [])
			return
		}

		const allowedLanguageIds = new Set(['typescript', 'typescriptreact', 'javascript', 'javascriptreact'])

		if (!allowedLanguageIds.has(activeEditor.document.languageId)) return

		const taggedRanges = computeTaggedTemplateRanges(activeEditor.document)
		applyDecorations(activeEditor, taggedRanges)
	}

	function triggerRefresh(editor?: vscode.TextEditor) {
		if (debounceTimer) clearTimeout(debounceTimer)
		debounceTimer = setTimeout(() => refresh(editor), 150)
	}

	ctx.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor((e) => refresh(e ?? undefined)),
		vscode.workspace.onDidChangeTextDocument((e) => {
			if (vscode.window.activeTextEditor?.document === e.document) {
				triggerRefresh()
			}
		}),
		vscode.window.onDidChangeVisibleTextEditors(() => refresh()),
		vscode.window.onDidChangeActiveColorTheme(() => {
			disposeAllDecorationTypes()
			refresh()
		}),
		vscode.workspace.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration('taggedTemplates.enabled') || e.affectsConfiguration('taggedTemplates.tags')) {
				triggerRefresh()
			}
		}),
	)

	refresh()
}

export function deactivate() {}
