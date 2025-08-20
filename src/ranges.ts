import * as vscode from 'vscode'
import * as ts from 'typescript'
import { getAllowedTags } from './config'

function getScriptKindFromLanguageId(languageId: string): ts.ScriptKind {
	switch (languageId) {
		case 'typescript':
			return ts.ScriptKind.TS
		case 'typescriptreact':
			return ts.ScriptKind.TSX
		case 'javascript':
			return ts.ScriptKind.JS
		case 'javascriptreact':
			return ts.ScriptKind.JSX
		default:
			return ts.ScriptKind.Unknown
	}
}

export interface TaggedTemplateRange {
	range: vscode.Range
	tagName: string
}

export function computeTaggedTemplateRanges(document: vscode.TextDocument): TaggedTemplateRange[] {
	const text = document.getText()
	const kind = getScriptKindFromLanguageId(document.languageId)
	const sourceFile = ts.createSourceFile(document.fileName, text, ts.ScriptTarget.Latest, false, kind)
	const allowedTags = getAllowedTags()

	const ranges: TaggedTemplateRange[] = []

	const visit = (node: ts.Node): void => {
		if (ts.isTaggedTemplateExpression(node)) {
			if (ts.isIdentifier(node.tag)) {
				const tagName = node.tag.text
				if (allowedTags.has(tagName)) {
					const template = node.template
					const start = template.getStart(sourceFile) + 1 // skip opening backtick
					const end = template.getEnd() - 1 // exclude closing backtick
					if (end > start) {
						const startPos = document.positionAt(start)
						const endPos = document.positionAt(end)
						ranges.push({
							range: new vscode.Range(startPos, endPos),
							tagName: tagName,
						})
					}
				}
			}
		}
		node.forEachChild(visit)
	}

	sourceFile.forEachChild(visit)
	return ranges
}
