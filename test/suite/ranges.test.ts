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
		const first = doc.getText(ranges[0].range)
		const second = doc.getText(ranges[1].range)
		assert.ok(first.includes('"id"'))
		assert.ok(second.includes('<div>'))
	})

	it('respects language id when parsing', async () => {
		const doc = await openDoc('const a = json`{\n  "x": 1\n}`', 'javascript')
		const ranges = computeTaggedTemplateRanges(doc)
		assert.strictEqual(ranges.length, 1)
	})

	it('includes tag names in returned ranges', async () => {
		const doc = await openDoc(
			['const a = json`{ "id": 1 }`', 'const b = html`<div>${x}</div>`', 'const c = sql`SELECT * FROM users`'].join(
				'\n',
			),
			'typescript',
		)
		const ranges = computeTaggedTemplateRanges(doc)
		assert.strictEqual(ranges.length, 3)

		const tagNames = ranges.map((r) => r.tagName)
		assert.deepStrictEqual(tagNames, ['json', 'html', 'sql'])
	})

	it('handles different tag types correctly', async () => {
		const doc = await openDoc(
			[
				'const jsonData = json`{ "name": "test" }`',
				'const htmlContent = html`<div>Hello</div>`',
				'const cssStyle = css`.class { color: red; }`',
				'const sqlQuery = sql`SELECT * FROM table`',
				'const graphqlQuery = graphql`query { user { id } }`',
				'const yamlConfig = yaml`name: test`',
				'const tsCode = ts`interface User { id: number }`',
				'const shellCmd = sh`echo "hello"`',
			].join('\n'),
			'typescript',
		)
		const ranges = computeTaggedTemplateRanges(doc)
		assert.strictEqual(ranges.length, 8)

		const expectedTags = ['json', 'html', 'css', 'sql', 'graphql', 'yaml', 'ts', 'sh']
		const actualTags = ranges.map((r) => r.tagName)
		assert.deepStrictEqual(actualTags, expectedTags)
	})

	it('handles tag aliases correctly', async () => {
		const doc = await openDoc(
			[
				'const gqlQuery = gql`query { user }`',
				'const ymlConfig = yml`name: test`',
				'const tsCode = typescript`type User = { id: number }`',
				'const bashCmd = bash`echo "hello"`',
				'const scssStyle = scss`.class { color: red; }`',
				'const rbCode = rb`puts "hello"`',
				'const pyCode = py`print("hello")`',
				'const goCode = golang`fmt.Println("hello")`',
				'const csCode = cs`Console.WriteLine("hello")`',
				'const mdContent = md`# Hello`',
				'const ignoreFile = ignore`node_modules/`',
				'const envVars = dotenv`API_KEY=123`',
			].join('\n'),
			'typescript',
		)
		const ranges = computeTaggedTemplateRanges(doc)
		assert.strictEqual(ranges.length, 12)

		const expectedTags = [
			'gql',
			'yml',
			'typescript',
			'bash',
			'scss',
			'rb',
			'py',
			'golang',
			'cs',
			'md',
			'ignore',
			'dotenv',
		]
		const actualTags = ranges.map((r) => r.tagName)
		assert.deepStrictEqual(actualTags, expectedTags)
	})

	it('handles additional languages', async () => {
		const doc = await openDoc(
			[
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
			'typescript',
		)
		const ranges = computeTaggedTemplateRanges(doc)
		assert.strictEqual(ranges.length, 10)

		const expectedTags = ['xml', 'java', 'ruby', 'python', 'php', 'go', 'csharp', 'markdown', 'gitignore', 'env']
		const actualTags = ranges.map((r) => r.tagName)
		assert.deepStrictEqual(actualTags, expectedTags)
	})
})
