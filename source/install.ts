// external
import {
	lines,
	t,
	i,
	ma,
	mul,
	mh2,
	mh3,
	mh4,
	mcode,
	mcodeblock,
} from '@bevry/render'

// local
import type { FilenamesForPackageFiles, Editions } from './types.js'
import { hydrateTextWithLinks } from './util.js'

function getNpmInstructionList(
	data: { name: string; main?: string; keywords?: string | string[] },
	commands: string[],
	local: boolean,
) {
	const label = `Executable${commands.length === 1 ? '' : 's'}`

	let importStatement = ''
	let requireStatement = ''
	if (local && data.main) {
		if (
			Array.isArray(data.keywords) &&
			data.keywords.includes('export-default')
		) {
			importStatement = `import pkg from ('${data.name}')`
			requireStatement = `const pkg = require('${data.name}').default`
		} else {
			importStatement = `import * as pkg from ('${data.name}')`
			requireStatement = `const pkg = require('${data.name}')`
		}
	}

	return mul([
		t([
			'Install:',
			mcode(`npm install ${local ? '--save' : '--global'} ${data.name}`),
		]),
		i(commands.length, () =>
			t([
				`${label}:`,
				commands
					.map((command) => (local ? `npx ${command}` : command))
					.map(mcode)
					.join(', '),
			]),
		),
		i(importStatement, () => t(['Import:', mcode(importStatement)])),
		i(requireStatement, () => t(['Require:', mcode(requireStatement)])),
	])
}

function getNpmInstructions(data: {
	name: string
	bin?: string | Record<string, string>
}) {
	const commands =
		typeof data.bin === 'string' ? [data.name] : Object.keys(data.bin || {})

	return lines([
		mh3(
			ma({
				inner: 'npm',
				url: 'https://npmjs.com',
				title: 'npm is a package manager for javascript',
			}),
		),
		i(commands.length, () => mh4('Install Globally')),
		i(commands.length, () => getNpmInstructionList(data, commands, false)),
		i(commands.length, () => mh4('Install Locally')),
		getNpmInstructionList(data, commands, true),
	])
}

function getDenoInstructions(data: {
	name: string
	version: string
	deno?: string
	keywords?: string | string[]
}) {
	const url =
		`https://unpkg.com/${data.name}@^${data.version}` +
		(data.deno ? `/${data.deno}` : '')
	const importer =
		Array.isArray(data.keywords) && data.keywords.includes('export-default')
			? `pkg`
			: '* as pkg'
	const imports = `import ${importer} from '${url}'`
	return lines([
		mh3(
			ma({
				inner: 'Deno',
				url: 'https://deno.land',
				title:
					'Deno is a secure runtime for JavaScript and TypeScript, it is an alternative for Node.js',
			}),
		),
		mcodeblock('typescript', `${imports}`),
	])
}

function getUnpkgInstructions(data: {
	name: string
	version: string
	keywords?: string | string[]
}) {
	const url = `//unpkg.com/${data.name}@^${data.version}`
	const importer =
		Array.isArray(data.keywords) && data.keywords.includes('export-default')
			? `pkg`
			: '* as pkg'
	const imports = `import ${importer} from '${url}'`
	return lines([
		mh3(
			ma({
				inner: 'unpkg',
				url: 'https://unpkg.com',
				title:
					'unpkg is a fast, global content delivery network for everything on npm',
			}),
		),
		mcodeblock('html', [
			'<script type="module">',
			`    ${imports}`,
			`</script>`,
		]),
	])
}

function getSkypackInstructions(data: {
	name: string
	version: string
	keywords?: string | string[]
}) {
	const url = `//cdn.skypack.dev/${data.name}@^${data.version}`
	const importer =
		Array.isArray(data.keywords) && data.keywords.includes('export-default')
			? `pkg`
			: '* as pkg'
	const imports = `import ${importer} from '${url}'`
	return lines([
		mh3(
			ma({
				inner: 'Skypack',
				url: 'https://www.skypack.dev',
				title: 'Skypack is a JavaScript Delivery Network for modern web apps',
			}),
		),
		mcodeblock('html', [
			'<script type="module">',
			`    ${imports}`,
			`</script>`,
		]),
	])
}

function getJspmInstructions(data: {
	name: string
	version: string
	keywords?: string | string[]
}) {
	const url = `//dev.jspm.io/${data.name}@${data.version}`
	const importer =
		Array.isArray(data.keywords) && data.keywords.includes('export-default')
			? `pkg`
			: '* as pkg'
	const imports = `import ${importer} from '${url}'`
	return lines([
		mh3(
			ma({
				inner: 'jspm',
				url: 'https://jspm.io',
				title: 'Native ES Modules CDN',
			}),
		),
		mcodeblock('html', [
			'<script type="module">',
			`    ${imports}`,
			`</script>`,
		]),
	])
}

function getTypeScriptInstructions() {
	return lines([
		hydrateTextWithLinks(mh3('TypeScript')),
		hydrateTextWithLinks(
			'This project provides its type information via inline JSDoc Comments. To make use of this in TypeScript, set your <code>maxNodeModuleJsDepth</code> compiler option to `5` or thereabouts. You can accomplish this via your `tsconfig.json` file like so:',
		),
		mcodeblock(
			'json',
			JSON.stringify(
				{
					compilerOptions: {
						maxNodeModuleJsDepth: 5,
					},
				},
				null,
				'  ',
			),
		),
	])
}

function getComponentInstructions(data: { name: string }) {
	return lines([
		mh3(
			ma({
				inner: 'Component',
				url: 'https://github.com/componentjs/component',
				title:
					'Frontend package manager and build tool for modular web applications',
			}),
		),
		mul(['Install: ' + mcode(`component install ${data.name}`)]),
	])
}

function getBowerInstructions(data: { name: string }) {
	return lines([
		mh3(
			ma({
				inner: 'Bower',
				url: 'https://bower.io',
				title: 'A package manager for the web',
			}),
		),
		mul(['Install: ' + mcode(`bower install ${data.name}`)]),
	])
}

function getEditionsInstructions(data: {
	name: string
	main?: string
	dependencies: Record<string, string>
	editions: Editions
}): string {
	if (!data.editions.length) return ''
	let hasDefaultEdition = false
	const editions = []
	for (const edition of data.editions) {
		const entryParts = []
		if (edition.directory) {
			entryParts.push(edition.directory)
		}
		if (edition.entry) {
			// handle the editions standard 1.3 and below
			// can't use substring, as we don't know if we have 1.3 and below or not
			if (edition.directory) {
				entryParts.push(
					edition.entry.replace(edition.directory.length + '/', ''),
				)
			} else {
				entryParts.push(edition.entry)
			}
		}
		const entry = entryParts.join('/')
		if (entry === data.main) {
			hasDefaultEdition = true
			editions.push(
				t([mcode(data.name), 'aliases', mcode(`${data.name}/${data.main}`)]),
			)
		}
		editions.push(
			t([mcode(`${data.name}/${entry}`), 'is', edition.description]),
		)
	}

	// Autoloaders
	if (!hasDefaultEdition) {
		if ('editions' in data.dependencies) {
			editions.unshift(
				t([
					mcode(data.name),
					'aliases',
					mcode(`${data.name}/${data.main}`),
					`which uses the Editions Autoloader to automatically select the correct edition for the consumer's environment`,
				]),
			)
		} else if ('esnextguardian' in data.dependencies) {
			editions.unshift(
				t([
					mcode(data.name),
					'aliases',
					mcode(`${data.name}/${data.main}`),
					'which uses ESNextGuardian to automatically select the correct edition for the consumers environment',
				]),
			)
		}
	}

	// Compile result
	const result = lines([
		mh3('Editions'),
		'This package is published with the following editions:',
		mul(editions),
	])

	// Add links
	return hydrateTextWithLinks(result)
}

// Define
export function getInstallInstructions(data: {
	filenamesForPackageFiles: FilenamesForPackageFiles
	name: string
	version: string
	deno?: string
	main?: string
	browsers?: boolean
	module?: any
	dependencies: Record<string, string>
	devDependencies: Record<string, string>
	editions: Editions
	keywords: string[]
}): string {
	const parts = [mh2('Install')]

	// DocPad
	const prefix = 'docpad-plugin-'
	if (data.name.startsWith(prefix)) {
		const pluginName = data.name.substring(prefix.length)
		parts.push(
			t([
				'Install this DocPad plugin by entering',
				mcode(`docpad install ${pluginName}`),
				'into your terminal.',
			]),
		)
	} else {
		// Node
		if (data.filenamesForPackageFiles.package) {
			parts.push(getNpmInstructions(data))

			// Deno
			if (data.deno) {
				parts.push(getDenoInstructions(data))
			}

			// Browser
			if (data.browsers) {
				if (data.module) {
					parts.push(getSkypackInstructions(data))
					parts.push(getUnpkgInstructions(data))
				}
				parts.push(getJspmInstructions(data))
			}
		}

		// Component
		if (data.filenamesForPackageFiles.component) {
			parts.push(getComponentInstructions(data))
		}

		// Bower
		if (data.filenamesForPackageFiles.bower) {
			parts.push(getBowerInstructions(data))
		}

		// Editions
		if (data.editions) {
			parts.push(getEditionsInstructions(data))
		}
	}

	if (data.main && data.devDependencies && data.devDependencies.jsdoc) {
		parts.push(getTypeScriptInstructions())
	}

	return lines(parts)
}
