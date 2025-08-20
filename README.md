<div align="center">
  <img src="media/icon.png" alt="Tagged Templates Icon" width="128" height="128">
  <h1>Tagged Templates</h1>
</div>

Syntax highlighting and subtle background tint for curated tagged template literals in JS/TS.

Editor-only: This extension only provides syntax highlighting and tinting in the editor. It never runs, evaluates, parses, or transforms your tagged template literals at runtime.

![Screenshot showing tagged template literals with syntax highlighting and background tinting](media/screemshot.png)

## What it does

- Highlights the content of tagged templates using the target language grammar (e.g., `json\`...\`` uses JSON).
- Adds a theme-aware background tint and optional border to embedded regions.
- Purely editor-side: zero runtime behavior or code transformation.

Supported tags (MVP): `json`, `html`, `css`, `scss`, `sql`, `graphql`/`gql`, `yaml`/`yml`, `xml`, `ts`, `sh`/`bash`.

## Usage

Open a `.ts/.tsx/.js/.jsx` file with tagged templates:

```ts
const j = json`{ "name": "mike", "version": "1.2.3" }`
const h = html`<div class="x">${x}</div>`
const q = sql`select * from users where id = ${id}`
```

### Declaring tags in your project (optional)

For runtime safety and to make your editor aware of the tags, declare simple stubs using `String.raw`. This is a great way to add named tags without changing runtime behavior (a no-op passthrough):

```ts
// e.g. src/tags.ts
export type TaggedTemplate = (strings: TemplateStringsArray, ...exprs: unknown[]) => string
export const json: TaggedTemplate = String.raw
export const html: TaggedTemplate = String.raw
export const sql: TaggedTemplate = String.raw
// add others if you use them (css, scss, graphql, yaml, xml, ts, sh, bash)
```

Then import and use them:

```ts
import { json, html, sql } from './tags'

const j = json`{ "name": "mike" }`
const h = html`<div>${j}</div>`
const q = sql`select * from t where id = ${42}`
```

All this extension cares about is the _name of the tag_ on the template literal. It's compatible with simple passthrough tags created with `String.raw` and with real tag implementations that parse/transform at runtime (for example, `gql` from [graphql-tag](https://github.com/apollographql/graphql-tag)).

If you want to use other definitions of the tagged template literals (e.g. one that actually returns JSON from a ``json`{ foo: "bar" }` ``), you can easily do so

```ts
type JsonValue = null | boolean | number | string | JsonValue[] | { [k: string]: JsonValue }

const json = (strings: TemplateStringsArray, ...exprs: unknown[]): JsonValue => {
	// Build a single string, JSON-stringifying interpolations so they embed as valid JSON fragments
	let combined = strings[0]
	for (let i = 0; i < exprs.length; i++) {
		combined += JSON.stringify(exprs[i]) + strings[i + 1]
	}

	// Allow a slightly lenient authoring style (unquoted keys, single quotes, trailing commas)
	const normalized = normalizeToStrictJson(combined)
	return JSON.parse(normalized) as JsonValue
}

function normalizeToStrictJson(input: string): string {
	let s = input
	// Quote unquoted object keys: { foo: 1, bar_baz: 2 } -> { "foo": 1, "bar_baz": 2 }
	s = s.replace(/(\{|,)\s*([A-Za-z_][A-Za-z0-9_-]*)\s*:/g, '$1 "$2":')
	// Convert single-quoted strings to double-quoted
	s = s.replace(/'([^'\\]|\\.)*'/g, (match) => {
		const inner = match.slice(1, -1).replace(/\\'/g, "'").replace(/\"/g, '"')
		return '"' + inner.replace(/"/g, '\\"') + '"'
	})
	// Remove trailing commas
	s = s.replace(/,\s*([}\]])/g, '$1')
	return s
}

// Example:
// const value = json`{ foo: "bar" }` // -> { foo: "bar" }
```

## Compatibility with real tag libraries

This extension works seamlessly with libraries that do more than simple passthrough at runtime. For example, `gql` from [graphql-tag](https://github.com/apollographql/graphql-tag) parses GraphQL strings into an AST. The extension will still inject GraphQL syntax highlighting inside the `gql\`...\`` template, because it keys off the tag name:

```ts
import gql from 'graphql-tag'

const query = gql`
	query User($id: ID!) {
		user(id: $id) {
			id
			name
		}
	}
`
```

## Settings

```json
"taggedTemplates.enabled": true,
"taggedTemplates.tags": { "json": "source.json", "html": "text.html.basic", ... }
```

## Color customization

The extension now supports per-language color customizations! Each tagged template type can have its own background and border colors.

### Per-language colors

Override specific language colors via `workbench.colorCustomizations`:

```json
{
	"workbench.colorCustomizations": {
		// JSON tagged templates
		"taggedTemplates.json.background": "#FFFFFF14",
		"taggedTemplates.json.border": "#FFFFFF33",

		// HTML tagged templates
		"taggedTemplates.html.background": "#FF6B3514",
		"taggedTemplates.html.border": "#FF6B3533",

		// SQL tagged templates
		"taggedTemplates.sql.background": "#4FC3F714",
		"taggedTemplates.sql.border": "#4FC3F733",

		// CSS tagged templates
		"taggedTemplates.css.background": "#FF980014",
		"taggedTemplates.css.border": "#FF980033",

		// GraphQL tagged templates
		"taggedTemplates.graphql.background": "#E1009814",
		"taggedTemplates.graphql.border": "#E1009833",

		// YAML tagged templates
		"taggedTemplates.yaml.background": "#FFEB3B14",
		"taggedTemplates.yaml.border": "#FFEB3B33",

		// TypeScript tagged templates
		"taggedTemplates.ts.background": "#3178C614",
		"taggedTemplates.ts.border": "#3178C633",

		// Shell tagged templates
		"taggedTemplates.shell.background": "#4CAF5014",
		"taggedTemplates.shell.border": "#4CAF5033",

		// Default for other languages
		"taggedTemplates.default.background": "#FFFFFF14",
		"taggedTemplates.default.border": "#FFFFFF33"
	}
}
```

### Supported languages with distinct colors

- **JSON**: White/neutral tint
- **HTML**: Orange/brown tint
- **CSS**: Orange tint
- **SQL**: Blue tint
- **GraphQL**: Purple tint
- **YAML**: Yellow tint
- **TypeScript**: Blue tint
- **Shell**: Green tint
- **XML**: Red/orange tint
- **Java**: Red tint
- **Ruby**: Red tint
- **Python**: Blue tint
- **PHP**: Purple tint
- **Go**: Blue tint
- **C#**: Green tint
- **Markdown**: Black/white tint
- **Gitignore**: Red tint
- **Environment variables**: Brown tint

### Legacy support

For backward compatibility, you can still use the old global colors (they will apply to the default category):

```json
{
	"workbench.colorCustomizations": {
		"taggedTemplates.background": "#FFFFFF14",
		"taggedTemplates.border": "#FFFFFF33"
	}
}
```

## Notes

- Only simple `identifier` followed by backtick is supported in MVP.
- Interpolations `${...}` are delegated back to the host language for proper highlighting.
- This extension does not evaluate, lint, or validate the embedded content; it only affects editor highlighting and tinting.

## Development

### Prerequisites

- Node.js 20+ 
- pnpm

### Setup

```bash
pnpm install
```

### Development Commands

```bash
pnpm run build      # Build the extension
pnpm run test       # Run tests
pnpm run lint       # Run ESLint
pnpm run format     # Format code with Prettier
pnpm run package    # Package extension as .vsix
```

### Versioning and Releases

This project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs automatically.

#### Making Changes

When you make changes that should be included in a release:

1. **Create a changeset**: Run `pnpm changeset` to create a new changeset file
2. **Select the type of change**: Choose from `major`, `minor`, or `patch`
3. **Write a description**: Describe what changed and why
4. **Commit the changeset**: The changeset file will be committed automatically

#### Releasing

To create a new release:

1. **Version packages**: Run `pnpm version` to update versions and generate changelog
2. **Review changes**: Check the generated changelog and version updates
3. **Publish**: The GitHub Actions workflow will automatically publish when changesets are merged to main

#### Changeset Commands

```bash
pnpm changeset    # Create a new changeset
pnpm version      # Update versions and generate changelog (manual)
pnpm release:manual # Build and publish manually (if needed)
```

### CI/CD

This project uses GitHub Actions for continuous integration and deployment:

#### CI Workflow (`.github/workflows/ci.yml`)

- Runs on push to `main`/`develop` branches and pull requests
- Tests against Node.js 18.x and 20.x
- Runs linting, formatting checks, building, and tests
- Packages the extension and uploads artifacts
- Performs security audits

#### Changesets Workflow (`.github/workflows/changesets.yml`)

- Triggers on main branch pushes and pull requests
- Automatically creates release pull requests when changesets are present
- Publishes to VS Code Marketplace when changesets are merged
- Creates GitHub releases with assets
- Handles versioning and changelog generation automatically

#### Required Secrets

To enable publishing to the VS Code Marketplace, add the following secret to your GitHub repository:

- `VSCE_PAT`: Your VS Code Extension Personal Access Token from https://dev.azure.com
