import * as path from 'node:path'
import { runTests } from '@vscode/test-electron'

async function main() {
	try {
		const extensionDevelopmentPath = path.resolve(__dirname, '../../')
		const extensionTestsPath = path.resolve(__dirname, './suite/index')

		await runTests({ extensionDevelopmentPath, extensionTestsPath })
	} catch (err: unknown) {
		if (err instanceof Error) {
			console.error(err.message)
		} else {
			console.error('Failed to run tests')
		}
		console.error('Failed to run tests')
		process.exit(1)
	}
}

main().catch(console.error)
