import * as assert from 'node:assert'
import { getConfiguredTagToScopeMap, getAllowedTags, isExtensionEnabled, getTagColorKey } from '../../src/config'

describe('config', () => {
	it('returns defaults when user setting is empty', () => {
		const map = getConfiguredTagToScopeMap()
		assert.strictEqual(map['json'], 'source.json')
		assert.strictEqual(map['html'], 'text.html.basic')
	})

	it('allowed tags derives from configured map', () => {
		const tags = getAllowedTags()
		assert.ok(tags.has('json'))
		assert.ok(tags.has('html'))
	})

	it('enabled flag defaults to true', () => {
		const enabled = isExtensionEnabled()
		assert.strictEqual(enabled, true)
	})

	describe('getTagColorKey', () => {
		it('returns correct color keys for core languages', () => {
			assert.strictEqual(getTagColorKey('json'), 'json')
			assert.strictEqual(getTagColorKey('html'), 'html')
			assert.strictEqual(getTagColorKey('css'), 'css')
			assert.strictEqual(getTagColorKey('sql'), 'sql')
			assert.strictEqual(getTagColorKey('graphql'), 'graphql')
			assert.strictEqual(getTagColorKey('yaml'), 'yaml')
			assert.strictEqual(getTagColorKey('ts'), 'ts')
			assert.strictEqual(getTagColorKey('sh'), 'shell')
		})

		it('handles aliases correctly', () => {
			assert.strictEqual(getTagColorKey('gql'), 'graphql')
			assert.strictEqual(getTagColorKey('yml'), 'yaml')
			assert.strictEqual(getTagColorKey('typescript'), 'ts')
			assert.strictEqual(getTagColorKey('bash'), 'shell')
			assert.strictEqual(getTagColorKey('scss'), 'css')
			assert.strictEqual(getTagColorKey('rb'), 'ruby')
			assert.strictEqual(getTagColorKey('py'), 'python')
			assert.strictEqual(getTagColorKey('golang'), 'go')
			assert.strictEqual(getTagColorKey('cs'), 'csharp')
			assert.strictEqual(getTagColorKey('md'), 'markdown')
			assert.strictEqual(getTagColorKey('ignore'), 'gitignore')
			assert.strictEqual(getTagColorKey('dotenv'), 'env')
		})

		it('returns default for unknown tags', () => {
			assert.strictEqual(getTagColorKey('unknown'), 'default')
			assert.strictEqual(getTagColorKey('custom'), 'default')
		})

		it('handles additional languages with distinct colors', () => {
			assert.strictEqual(getTagColorKey('xml'), 'xml')
			assert.strictEqual(getTagColorKey('java'), 'java')
			assert.strictEqual(getTagColorKey('ruby'), 'ruby')
			assert.strictEqual(getTagColorKey('python'), 'python')
			assert.strictEqual(getTagColorKey('php'), 'php')
			assert.strictEqual(getTagColorKey('go'), 'go')
			assert.strictEqual(getTagColorKey('csharp'), 'csharp')
			assert.strictEqual(getTagColorKey('markdown'), 'markdown')
			assert.strictEqual(getTagColorKey('gitignore'), 'gitignore')
			assert.strictEqual(getTagColorKey('env'), 'env')
		})
	})
})
