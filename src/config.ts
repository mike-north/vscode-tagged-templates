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

// Map tag names to their color theme keys
const tagToColorMap: Record<string, string> = {
	// Core languages with dedicated colors
	json: 'json',
	html: 'html',
	css: 'css',
	scss: 'css', // Use CSS colors for SCSS
	sql: 'sql',
	graphql: 'graphql',
	gql: 'graphql', // Use GraphQL colors for gql
	yaml: 'yaml',
	yml: 'yaml', // Use YAML colors for yml
	ts: 'ts',
	typescript: 'ts', // Use TS colors for typescript
	sh: 'shell',
	bash: 'shell', // Use shell colors for bash

	// Additional languages that could benefit from distinct colors
	xml: 'xml',
	java: 'java',
	ruby: 'ruby',
	rb: 'ruby', // Use Ruby colors for rb
	python: 'python',
	py: 'python', // Use Python colors for py
	php: 'php',
	go: 'go',
	golang: 'go', // Use Go colors for golang
	csharp: 'csharp',
	cs: 'csharp', // Use C# colors for cs
	md: 'markdown',
	markdown: 'markdown',
	gitignore: 'gitignore',
	ignore: 'gitignore', // Use gitignore colors for ignore
	env: 'env',
	dotenv: 'env', // Use env colors for dotenv
}

export function getTagColorKey(tagName: string): string {
	return tagToColorMap[tagName] || 'default'
}
