import { spawnSync, type SpawnSyncOptions } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import fixturify from 'fixturify'
import * as ts from 'typescript'

function run(command: string, args: string[], options: SpawnSyncOptions = {}): void {
	const result = spawnSync(command, args, {
		stdio: 'inherit',
		shell: process.platform === 'win32',
		...options,
	})
	if (result.status !== 0) {
		process.exit(result.status ?? 1)
	}
}

// 1) Build the extension
console.log('• Compiling extension...')
run('pnpm', ['run', 'compile'])

// 2) Create a temp example project
console.log('• Creating temp fixture project...')
const root = mkdtempSync(join(tmpdir(), 'tagged-tinted-templates-'))
const projectRoot = join(root, 'example')

const bt = '`'
const embeddedTsCode = [
	'export function add(a: number, b: number) {',
	'  return a + b;',
	'}',
	'const sum: number = add(1, 2);',
	'',
].join('\n')

const indexTs = [
	'// Minimal declarations and runtime stubs for tagged templates used below',
	'type TaggedTemplate = (strings: TemplateStringsArray, ...exprs: unknown[]) => string;',
	'const json: TaggedTemplate = String.raw;',
	'const html: TaggedTemplate = String.raw;',
	'const sql: TaggedTemplate = String.raw;',
	'const ts: TaggedTemplate = String.raw;',
	'',
	'const data = { name: "Mike" };',
	'const myJson = json' + bt + '{ "name": "demo", "value": 42 }' + bt + ';',
	'const markup = html' + bt + '<div class="wrap">${data.name}</div>' + bt + ';',
	'const query = sql' + bt + 'select * from users where id = ${42}' + bt + ';',
	'const tsDemo = ts' + bt + embeddedTsCode + bt + ';',
	'',
	'console.log(markup, query);',
	'',
].join('\n')

const indexJs = [
	'// Minimal runtime stubs for tagged templates used below',
	'const json = String.raw;',
	'const html = String.raw;',
	'const sql = String.raw;',
	'',
	'const data = json' + bt + '{ "name": "demo", "value": 42 }' + bt + ';',
	'const markup = html' + bt + '<div class="wrap">${data.name}</div>' + bt + ';',
	'const query = sql' + bt + 'select * from users where id = ${42}' + bt + ';',
	'console.log(markup, query);',
	'',
].join('\n')

fixturify.writeSync(projectRoot, {
	'package.json': JSON.stringify({ name: 'example', private: true }, null, 2),
	'tsconfig.json': JSON.stringify({ compilerOptions: { target: 'ES2020' } }, null, 2),
	'index.ts': indexTs,
	'index.js': indexJs,
})

// 2b) Type-check the embedded TS snippet itself
console.log('• Type-checking embedded TS snippet...')
const embeddedFile = join(projectRoot, 'embedded.ts')
writeFileSync(embeddedFile, embeddedTsCode, 'utf8')

const program = ts.createProgram([embeddedFile], {
	target: ts.ScriptTarget.ES2020,
	module: ts.ModuleKind.ESNext,
	strict: true,
	skipLibCheck: true,
	noEmit: true,
})
const diagnostics = ts.getPreEmitDiagnostics(program)
if (diagnostics.length > 0) {
	const formatHost: ts.FormatDiagnosticsHost = {
		getCanonicalFileName: (f) => f,
		getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
		getNewLine: () => ts.sys.newLine,
	}
	console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, formatHost))
	process.exit(1)
}

// 3) Launch VS Code with a clean profile and only this extension in dev mode
console.log('• Launching VS Code (clean)...')
const extensionDevPath = process.cwd()
const userDataDir = join(root, 'vscode-user')
const extensionsDir = join(root, 'vscode-extensions')

const codeCmd = process.env.VSCODE_BIN || 'code'
const args = [
	projectRoot,
	'--new-window',
	'--disable-extensions',
	`--extensionDevelopmentPath=${extensionDevPath}`,
	`--user-data-dir=${userDataDir}`,
	`--extensions-dir=${extensionsDir}`,
]

run(codeCmd, args, { cwd: projectRoot })

console.log(`• Temp project at: ${projectRoot}`)
