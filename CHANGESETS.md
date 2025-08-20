# Changesets Guide

This project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs automatically. This guide explains how to use Changesets effectively.

## What is Changesets?

Changesets is a tool that helps manage versioning and changelogs for packages. It's particularly useful for:

- Automatically bumping package versions based on semantic versioning
- Generating changelogs from human-readable descriptions
- Managing releases in a consistent way
- Supporting both single-package and multi-package repositories

## Workflow Overview

1. **Make changes** to your code
2. **Create a changeset** describing what changed
3. **Version and release** when ready to publish

## Making Changes

### Step 1: Create a Changeset

When you make changes that should be included in a release, create a changeset:

```bash
pnpm changeset
```

This will:

1. Ask you to select the type of change (major, minor, patch)
2. Ask for a summary of the changes
3. Create a changeset file in the `.changeset` directory
4. Automatically commit the changeset file

### Step 2: Select Change Type

Choose the appropriate semantic versioning bump:

- **patch**: Bug fixes and minor improvements (0.1.0 → 0.1.1)
- **minor**: New features, backward compatible (0.1.0 → 0.2.0)
- **major**: Breaking changes (0.1.0 → 1.0.0)

### Step 3: Write a Summary

Write a clear, concise description of what changed. This will appear in the changelog.

**Good examples:**

- "Add support for Python tagged templates"
- "Fix JSON syntax highlighting in nested objects"
- "Update VS Code engine requirement to 1.84.0"

**Avoid:**

- "Fix stuff"
- "Update things"
- "Various improvements"

## Releasing

### Automated Release Process (Recommended)

The project includes a GitHub Actions workflow (`.github/workflows/changesets.yml`) that:

1. **On pull requests**: Checks for changesets and validates them
2. **On main branch**: Automatically creates release pull requests when changesets are present
3. **On release**: Publishes the extension to the VS Code Marketplace and creates GitHub releases

### Manual Release Process (Fallback)

If you need to release manually:

1. **Version packages**: Update versions and generate changelog

   ```bash
   pnpm version
   ```

2. **Review changes**: Check the generated changelog and version updates
   - Review `CHANGELOG.md` for accuracy
   - Verify version bump in `package.json`

3. **Publish**: Build and publish the extension
   ```bash
   pnpm release:manual
   ```

## Available Commands

```bash
# Create a new changeset
pnpm changeset

# Update versions and generate changelog (manual)
pnpm version

# Build and publish manually (if needed)
pnpm release:manual

# Check status of changesets
pnpm changeset status
```

## Configuration

The Changesets configuration is in `.changeset/config.json`:

```json
{
	"changelog": "@changesets/cli/changelog",
	"commit": true,
	"access": "public",
	"baseBranch": "main",
	"updateInternalDependencies": "patch",
	"ignore": []
}
```

### Key Settings

- **`commit`**: Automatically commit changeset files
- **`access`**: Set to "public" for VS Code extensions
- **`baseBranch`**: The main branch for the repository

## Best Practices

### Writing Good Changesets

1. **Be specific**: Describe exactly what changed
2. **Use present tense**: "Add feature" not "Added feature"
3. **Include context**: Explain why the change was made
4. **Group related changes**: Multiple related changes can go in one changeset

### When to Create Changesets

Create changesets for:

- ✅ New features
- ✅ Bug fixes
- ✅ Breaking changes
- ✅ Documentation updates (if significant)
- ✅ Performance improvements

Don't create changesets for:

- ❌ Typo fixes
- ❌ Minor formatting changes
- ❌ Test-only changes
- ❌ Internal refactoring (unless it affects the public API)

### Version Bumping Strategy

- **patch**: Bug fixes, minor improvements, documentation updates
- **minor**: New features, new template types, new configuration options
- **major**: Breaking changes, major API changes, dropping VS Code version support

## Troubleshooting

### Common Issues

1. **"No changesets found"**: Make sure you've created a changeset with `pnpm changeset`
2. **Version conflicts**: If there are conflicts, resolve them manually and run `pnpm version` again
3. **Publish failures**: Check that you have the correct tokens set up in GitHub Secrets

### Getting Help

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Changesets GitHub Discussions](https://github.com/changesets/changesets/discussions)
- [VS Code Extension Publishing Guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

## Examples

### Example Changeset File

```markdown
---
'vscode-tagged-templates': minor
---

Add support for Python tagged templates with syntax highlighting and background tinting
```

### Example Changelog Entry

```markdown
## [0.2.0] - 2024-01-15

### Added

- Add support for Python tagged templates with syntax highlighting and background tinting
- New configuration option for custom tag mappings

### Fixed

- Fix JSON syntax highlighting in nested template literals
```

## Integration with VS Code Extension Publishing

The automated workflow:

1. Builds the extension using `pnpm run build`
2. Uses the Changesets action to handle versioning and publishing
3. Uses the `VSCE_PAT` secret to publish to the VS Code Marketplace
4. Creates GitHub releases with assets automatically

Make sure you have the following GitHub Secrets configured:

- `VSCE_PAT`: Your VS Code Extension Personal Access Token
- `NPM_TOKEN`: (Optional) For publishing to npm if needed
