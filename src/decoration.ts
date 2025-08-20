import * as vscode from 'vscode'
import { getTagColorKey } from './config'

// Cache for decoration types to avoid recreating them
const decorationTypeCache = new Map<string, vscode.TextEditorDecorationType>()

export function createDecorationType(tagName: string): vscode.TextEditorDecorationType {
	const colorKey = getTagColorKey(tagName)

	// Check if we already have a decoration type for this color key
	if (decorationTypeCache.has(colorKey)) {
		return decorationTypeCache.get(colorKey)!
	}

	const decorationType = vscode.window.createTextEditorDecorationType({
		backgroundColor: new vscode.ThemeColor(`taggedTemplates.${colorKey}.background`),
		border: '1px solid',
		borderColor: new vscode.ThemeColor(`taggedTemplates.${colorKey}.border`),
		rangeBehavior: vscode.DecorationRangeBehavior.ClosedOpen,
	})

	// Cache the decoration type
	decorationTypeCache.set(colorKey, decorationType)

	return decorationType
}

export function applyDecorations(
	editor: vscode.TextEditor,
	taggedRanges: Array<{ range: vscode.Range; tagName: string }>,
): void {
	// Group ranges by tag name to apply decorations efficiently
	const rangesByTag = new Map<string, vscode.Range[]>()

	for (const { range, tagName } of taggedRanges) {
		const colorKey = getTagColorKey(tagName)
		if (!rangesByTag.has(colorKey)) {
			rangesByTag.set(colorKey, [])
		}
		rangesByTag.get(colorKey)!.push(range)
	}

	// Apply decorations for each tag type
	for (const [colorKey, ranges] of rangesByTag) {
		const decorationType = createDecorationType(colorKey)
		editor.setDecorations(decorationType, ranges)
	}
}

export function disposeAllDecorationTypes(): void {
	for (const decorationType of decorationTypeCache.values()) {
		decorationType.dispose()
	}
	decorationTypeCache.clear()
}

export function disposeDecorationType(decoration: vscode.TextEditorDecorationType): void {
	decoration.dispose()
}
