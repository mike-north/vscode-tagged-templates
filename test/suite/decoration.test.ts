import * as assert from 'node:assert'
import { createDecorationType, disposeDecorationType } from '../../src/decoration'

describe('decoration', () => {
	it('creates and disposes a decoration type', () => {
		const dt = createDecorationType()
		assert.strictEqual(typeof dt.dispose, 'function')
		disposeDecorationType(dt)
	})
})
