import * as vscode from 'vscode'

const defaultTagToScopeMap: Record<string, string> = {
	json: 'source.json',
	html: 'text.html.basic',
	css: 'source.css',
	scss: 'source.scss',
	sql: 'source.sql',
	graphql: 'source.graphql',
	gql: 'source.graphql',
	yaml: 'source.yaml',
	yml: 'source.yaml',
	xml: 'text.xml',
	ts: 'source.ts',
	typescript: 'source.ts',
	sh: 'source.shell',
	bash: 'source.shell',
	java: 'source.java',
	ruby: 'source.ruby',
	rb: 'source.ruby',
	python: 'source.python',
	py: 'source.python',
	php: 'source.php',
	go: 'source.go',
	golang: 'source.go',
	csharp: 'source.cs',
	cs: 'source.cs',
	md: 'text.html.markdown',
	markdown: 'text.html.markdown',
	gitignore: 'source.gitignore',
	ignore: 'source.gitignore',
	env: 'source.dotenv',
	dotenv: 'source.dotenv',
}

export function getConfiguredTagToScopeMap(): Record<string, string> {
	const cfg = vscode.workspace.getConfiguration('taggedTemplates')
	const user = cfg.get<Record<string, string>>('tags')
	return user && Object.keys(user).length > 0 ? user : defaultTagToScopeMap
}

export function getAllowedTags(): Set<string> {
	return new Set(Object.keys(getConfiguredTagToScopeMap()))
}

export function isExtensionEnabled(): boolean {
	const cfg = vscode.workspace.getConfiguration('taggedTemplates')
	return cfg.get<boolean>('enabled', true)
}
