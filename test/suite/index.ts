import * as path from 'node:path'
import * as Mocha from 'mocha'
import * as glob from 'glob'

export function run(): Promise<void> {
	const mocha = new Mocha({
		ui: 'bdd',
		color: true,
	})

	const testsRoot = path.resolve(__dirname, '..')

	return new Promise((resolve, reject) => {
		try {
			const files = glob.sync('**/**.test.js', { cwd: testsRoot })
			files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)))

			mocha.run((failures) => {
				if (failures > 0) {
					reject(new Error(`${failures} tests failed.`))
				} else {
					resolve()
				}
			})
		} catch (err: unknown) {
			reject(err instanceof Error ? err : new Error(String(err)))
		}
	})
}
