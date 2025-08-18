import * as assert from 'node:assert'

import * as vscode from 'vscode'
import { computeTaggedTemplateRanges } from '../../src/ranges'

async function openDoc(text: string, languageId: string) {
	return await vscode.workspace.openTextDocument({ content: text, language: languageId })
}

describe('computeTaggedTemplateRanges', () => {
	it('finds ranges for allowed tag names', async () => {
		const doc = await openDoc(
			['const a = json`{ "id": 1 }`', 'const b = html`<div>${x}</div>`', 'const c = nope`not included`'].join('\n'),
			'typescript',
		)
		const ranges = computeTaggedTemplateRanges(doc)
		assert.strictEqual(ranges.length, 2)
		const first = doc.getText(ranges[0])
		const second = doc.getText(ranges[1])
		assert.ok(first.includes('"id"'))
		assert.ok(second.includes('<div>'))
	})

	it('respects language id when parsing', async () => {
		const doc = await openDoc('const a = json`{\n  "x": 1\n}`', 'javascript')
		const ranges = computeTaggedTemplateRanges(doc)
		assert.strictEqual(ranges.length, 1)
	})
})
