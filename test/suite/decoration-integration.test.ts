import * as assert from 'node:assert'
import * as vscode from 'vscode'
import { applyDecorations, disposeAllDecorationTypes } from '../../src/decoration'
import { computeTaggedTemplateRanges } from '../../src/ranges'

describe('decoration integration', () => {
	afterEach(() => {
		disposeAllDecorationTypes()
	})

	it('applies decorations for different tag types', async () => {
		const doc = await vscode.workspace.openTextDocument({
			content: [
				'const jsonData = json`{ "name": "test" }`',
				'const htmlContent = html`<div>Hello</div>`',
				'const sqlQuery = sql`SELECT * FROM users`',
			].join('\n'),
			language: 'typescript',
		})

		const editor = await vscode.window.showTextDocument(doc)
		const taggedRanges = computeTaggedTemplateRanges(doc)

		// Should not throw when applying decorations
		assert.doesNotThrow(() => {
			applyDecorations(editor, taggedRanges)
		})

		// Should have 3 ranges with different tag names
		assert.strictEqual(taggedRanges.length, 3)
		assert.strictEqual(taggedRanges[0].tagName, 'json')
		assert.strictEqual(taggedRanges[1].tagName, 'html')
		assert.strictEqual(taggedRanges[2].tagName, 'sql')
	})

	it('handles empty ranges gracefully', async () => {
		const doc = await vscode.workspace.openTextDocument({
			content: 'const data = "no tagged templates here"',
			language: 'typescript',
		})

		const editor = await vscode.window.showTextDocument(doc)
		const taggedRanges = computeTaggedTemplateRanges(doc)

		// Should not throw when applying empty decorations
		assert.doesNotThrow(() => {
			applyDecorations(editor, taggedRanges)
		})

		assert.strictEqual(taggedRanges.length, 0)
	})

	it('groups ranges by color key correctly', async () => {
		const doc = await vscode.workspace.openTextDocument({
			content: [
				'const graphqlQuery = graphql`query { user }`',
				'const gqlQuery = gql`query { post }`', // Should use same color as graphql
				'const jsonData = json`{ "id": 1 }`',
				'const ymlConfig = yml`name: test`', // Should use same color as yaml
				'const yamlConfig = yaml`version: 1.0`',
			].join('\n'),
			language: 'typescript',
		})

		const editor = await vscode.window.showTextDocument(doc)
		const taggedRanges = computeTaggedTemplateRanges(doc)

		// Should not throw when applying decorations
		assert.doesNotThrow(() => {
			applyDecorations(editor, taggedRanges)
		})

		// Should have 5 ranges
		assert.strictEqual(taggedRanges.length, 5)

		// Check that aliases are properly handled
		const tagNames = taggedRanges.map((r) => r.tagName)
		assert.deepStrictEqual(tagNames, ['graphql', 'gql', 'json', 'yml', 'yaml'])
	})

	it('handles all supported language types', async () => {
		const doc = await vscode.workspace.openTextDocument({
			content: [
				'const jsonData = json`{ "id": 1 }`',
				'const htmlContent = html`<div>Hello</div>`',
				'const cssStyle = css`.class { color: red; }`',
				'const sqlQuery = sql`SELECT * FROM users`',
				'const graphqlQuery = graphql`query { user }`',
				'const yamlConfig = yaml`name: test`',
				'const tsCode = ts`interface User { id: number }`',
				'const shellCmd = sh`echo "hello"`',
				'const xmlData = xml`<root><item>test</item></root>`',
				'const javaCode = java`public class Test { }`',
				'const rubyCode = ruby`puts "hello"`',
				'const pythonCode = python`print("hello")`',
				'const phpCode = php`<?php echo "hello"; ?>`',
				'const goCode = go`fmt.Println("hello")`',
				'const csharpCode = csharp`Console.WriteLine("hello");`',
				'const markdownContent = markdown`# Hello`',
				'const gitignoreContent = gitignore`node_modules/`',
				'const envContent = env`API_KEY=123`',
			].join('\n'),
			language: 'typescript',
		})

		const editor = await vscode.window.showTextDocument(doc)
		const taggedRanges = computeTaggedTemplateRanges(doc)

		// Should not throw when applying decorations for all language types
		assert.doesNotThrow(() => {
			applyDecorations(editor, taggedRanges)
		})

		// Should have 18 ranges (one for each supported language)
		assert.strictEqual(taggedRanges.length, 18)

		const expectedTags = [
			'json',
			'html',
			'css',
			'sql',
			'graphql',
			'yaml',
			'ts',
			'sh',
			'xml',
			'java',
			'ruby',
			'python',
			'php',
			'go',
			'csharp',
			'markdown',
			'gitignore',
			'env',
		]
		const actualTags = taggedRanges.map((r) => r.tagName)
		assert.deepStrictEqual(actualTags, expectedTags)
	})
})
