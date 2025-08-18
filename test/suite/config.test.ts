import * as assert from 'node:assert'
import { getConfiguredTagToScopeMap, getAllowedTags, isExtensionEnabled } from '../../src/config'

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
})
