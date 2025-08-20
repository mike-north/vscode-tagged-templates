import * as assert from 'node:assert'
import * as vscode from 'vscode'
import { createDecorationType, disposeDecorationType, disposeAllDecorationTypes } from '../../src/decoration'

describe('decoration', () => {
	afterEach(() => {
		disposeAllDecorationTypes()
	})

	describe('createDecorationType', () => {
		it('creates decoration type for specific tag', () => {
			const dt = createDecorationType('json')
			assert.strictEqual(typeof dt.dispose, 'function')
			disposeDecorationType(dt)
		})

		it('creates different decoration types for different tags', () => {
			const jsonDt = createDecorationType('json')
			const htmlDt = createDecorationType('html')
			const sqlDt = createDecorationType('sql')

			// Should be different decoration types
			assert.notStrictEqual(jsonDt, htmlDt)
			assert.notStrictEqual(htmlDt, sqlDt)
			assert.notStrictEqual(jsonDt, sqlDt)

			disposeAllDecorationTypes()
		})

		it('caches decoration types for same color keys', () => {
			const dt1 = createDecorationType('json')
			const dt2 = createDecorationType('json')

			// Should be the same decoration type (cached)
			assert.strictEqual(dt1, dt2)

			disposeAllDecorationTypes()
		})

		it('handles aliases with same color keys', () => {
			const graphqlDt = createDecorationType('graphql')
			const gqlDt = createDecorationType('gql')

			// Should be the same decoration type (both use 'graphql' color key)
			assert.strictEqual(graphqlDt, gqlDt)

			disposeAllDecorationTypes()
		})

		it('handles unknown tags with default colors', () => {
			const dt = createDecorationType('unknown')
			assert.strictEqual(typeof dt.dispose, 'function')
			disposeDecorationType(dt)
		})
	})

	describe('disposeAllDecorationTypes', () => {
		it('disposes all cached decoration types', () => {
			const dt1 = createDecorationType('json')
			const dt2 = createDecorationType('html')
			const dt3 = createDecorationType('sql')

			// Should not throw when disposing all
			assert.doesNotThrow(() => {
				disposeAllDecorationTypes()
			})
		})
	})
})
