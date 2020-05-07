import { getLink } from './util.js'
import { Link, FilenamesForPackageFiles, Editions } from './types.js'

function hydrateTextWithLinks(text: string) {
	const linksArray: Link[] = [
		{
			text: 'Editions Autoloader',
			url: 'https://github.com/bevry/editions',
			title:
				'You can use the Editions Autoloader to autoload the appropriate edition for your consumers environment',
		},
		{
			text: 'Editions',
			url: 'https://editions.bevry.me',
			title:
				'Editions are the best way to produce and consume packages you care about.',
		},
		{
			text: 'ESNextGuardian',
			url: 'https://github.com/bevry/esnextguardian',
			title:
				"Loads ES6+ files if the user's environment supports it, otherwise gracefully fallback to ES5 files.",
		},
		{
			text: "Babel's Polyfill",
			url: 'https://babeljs.io/docs/usage/polyfill/',
			title: 'A polyfill that emulates missing ECMAScript environment features',
		},
		{
			text: 'Babel',
			url: 'https://babeljs.io',
			title: 'The compiler for writing next generation JavaScript',
		},
		{
			text: 'CoffeeScript',
			url: 'https://coffeescript.org',
			title: 'CoffeeScript is a little language that compiles into JavaScript',
		},
		{
			text: 'Require',
			url: 'https://nodejs.org/dist/latest-v5.x/docs/api/modules.html',
			title: 'Node/CJS Modules',
		},
		{
			text: 'Import',
			url: 'https://babeljs.io/docs/learn-es2015/#modules',
			title: 'ECMAScript Modules',
		},
		{
			text: 'ESNext',
			url: 'https://en.wikipedia.org/wiki/ECMAScript#ES.Next',
			title: 'ECMAScript Next',
		},
		{
			text: 'ES2019',
			url:
				'https://en.wikipedia.org/wiki/ECMAScript#10th_Edition_-_ECMAScript_2019',
			title: 'ECMAScript ES2019',
		},
		{
			text: 'ES2018',
			url:
				'https://en.wikipedia.org/wiki/ECMAScript#9th_Edition_-_ECMAScript_2018',
			title: 'ECMAScript ES2018',
		},
		{
			text: 'ES2017',
			url:
				'https://en.wikipedia.org/wiki/ECMAScript#8th_Edition_-_ECMAScript_2017',
			title: 'ECMAScript ES2017',
		},
		{
			text: 'ES2016',
			url:
				'https://en.wikipedia.org/wiki/ECMAScript#7th_Edition_-_ECMAScript_2016',
			title: 'ECMAScript 2016',
		},
		{
			text: 'ES2015',
			url: 'https://babeljs.io/docs/en/learn#ecmascript-2015-features',
			title: 'ECMAScript 2015',
		},
		{
			text: 'JSDoc Comments',
			url: 'http://usejsdoc.org',
			title:
				'JSDoc is an API documentation generator for JavaScript, similar to Javadoc or phpDocumentor',
		},
		{
			text: 'Flow Type Comments',
			url: 'http://flowtype.org/blog/2015/02/20/Flow-Comments.html',
			title: 'Flow is a static type checker for JavaScript',
		},
		{
			text: 'Flow Type',
			url: 'http://flowtype.org',
			title: 'Flow is a static type checker for JavaScript',
		},
		{
			text: 'JSX',
			url: 'https://facebook.github.io/jsx/',
			title: 'XML/HTML inside your JavaScript',
		},
		{
			text: 'Node.js',
			url: 'https://nodejs.org',
			title:
				"Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine",
		},
		{
			text: 'TypeScript',
			url: 'https://www.typescriptlang.org/',
			title:
				'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. ',
		},
	]

	// build a map
	const linksMap: Record<string, string> = {}
	for (const link of linksArray) {
		linksMap[link.text.toLowerCase()] = getLink(link)
	}

	// do the replacement
	const linksMatch = new RegExp(
		linksArray.map((link) => link.text).join('|'),
		'g'
	)
	return text.replace(linksMatch, function (match) {
		return linksMap[match.toLowerCase()]
	})
}

function getNpmInstructionList(
	data: { name: string; main?: string; keywords?: string | string[] },
	commands: string[],
	local: boolean
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

	return [
		'<ul>',
		`<li>Install: <code>npm install ${local ? '--save' : '--global'} ${
			data.name
		}</code></li>`,
		commands.length
			? `<li>${label}: <code>${commands
					.map((command) => (local ? `npx ${command}` : command))
					.join('</code>, <code>')}</code></li>`
			: '',
		importStatement ? `<li>Import: <code>${importStatement}</code></li>` : '',
		requireStatement
			? `<li>Require: <code>${requireStatement}</code></li>`
			: '',
		'</ul>',
	]
		.filter((i) => i)
		.join('\n')
}

function getNpmInstructions(data: {
	name: string
	main?: string
	bin?: string | Record<string, string>
}) {
	const commands =
		typeof data.bin === 'string' ? [data.name] : Object.keys(data.bin || {})

	return [
		getLink({
			text: '<h3>npm</h3>',
			url: 'https://npmjs.com',
			title: 'npm is a package manager for javascript',
		}),
		commands.length && '<h4>Install Globally</h4>',
		commands.length && getNpmInstructionList(data, commands, false),
		commands.length && '<h4>Install Locally</h4>',
		getNpmInstructionList(data, commands, true),
	]
		.filter((i) => i)
		.join('\n')
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
	return [
		getLink({
			text: '<h3>unpkg</h3>',
			url: 'https://unpkg.com',
			title:
				'unpkg is a fast, global content delivery network for everything on npm',
		}),
		'',
		'``` html',
		'<script type="module">',
		`    import ${importer} from '${url}'`,
		`</script>`,
		'```',
	].join('\n')
}

function getPikaInstructions(data: {
	name: string
	version: string
	keywords?: string | string[]
}) {
	const url = `//cdn.pika.dev/${data.name}/^${data.version}`
	const importer =
		Array.isArray(data.keywords) && data.keywords.includes('export-default')
			? `pkg`
			: '* as pkg'
	return [
		getLink({
			text: '<h3>pika</h3>',
			url: 'https://www.pika.dev/cdn',
			title: '100% Native ES Modules CDN',
		}),
		'',
		'``` html',
		'<script type="module">',
		`    import ${importer} from '${url}'`,
		`</script>`,
		'```',
	].join('\n')
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
	return [
		getLink({
			text: '<h3>jspm</h3>',
			url: 'https://jspm.io',
			title: 'Native ES Modules CDN',
		}),
		'',
		'``` html',
		'<script type="module">',
		`    import ${importer} from '${url}'`,
		`</script>`,
		'```',
	].join('\n')
}

function getTypeScriptInstructions() {
	return [
		hydrateTextWithLinks('<h3>TypeScript</h3>'),
		'',
		hydrateTextWithLinks(
			'This project provides its type information via inline JSDoc Comments. To make use of this in TypeScript, set your <code>maxNodeModuleJsDepth</code> compiler option to `5` or thereabouts. You can accomlish this via your `tsconfig.json` file like so:'
		),
		'',
		'``` json',
		JSON.stringify(
			{
				compilerOptions: {
					maxNodeModuleJsDepth: 5,
				},
			},
			null,
			'  '
		),
		'```',
	].join('\n')
}

function getComponentInstructions(data: { name: string }) {
	return [
		getLink({
			text: '<h3>Component</h3>',
			url: 'https://github.com/componentjs/component',
			title:
				'Frontend package manager and build tool for modular web applications',
		}),
		`<ul><li>Install: <code>component install ${data.name}</code></li></ul>`,
	].join('\n')
}

function getBowerInstructions(data: { name: string }) {
	return [
		getLink({
			text: '<h3>Bower</h3>',
			url: 'https://bower.io',
			title: 'A package manager for the web',
		}),
		`<ul><li>Install: <code>bower install ${data.name}</code></li></ul>`,
	].join('\n')
}

function getEditionsInstructions(data: {
	name: string
	main?: string
	dependencies: Record<string, string>
	editions: Editions
}) {
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
					edition.entry.replace(edition.directory.length + '/', '')
				)
			} else {
				entryParts.push(edition.entry)
			}
		}
		const entry = entryParts.join('/')
		if (entry === data.main) {
			hasDefaultEdition = true
			editions.push(
				`<code>${data.name}</code> aliases <code>${data.name}/${data.main}</code>`
			)
		}
		editions.push(
			`<code>${data.name}/${entry}</code> is ${edition.description}`
		)
	}

	// Autoloaders
	if (!hasDefaultEdition) {
		if ('editions' in data.dependencies) {
			editions.unshift(
				`<code>${data.name}</code> aliases <code>${data.name}/${data.main}</code> which uses the Editions Autoloader to automatically select the correct edition for the consumer's environment`
			)
		} else if ('esnextguardian' in data.dependencies) {
			editions.unshift(
				`<code>${data.name}</code> aliases <code>${data.name}/${data.main}</code> which uses ESNextGuardian to automatically select the correct edition for the consumers environment`
			)
		}
	}

	// Compile result
	const result = `<h3>Editions</h3>\n\n<p>This package is published with the following editions:</p>\n\n<ul><li>${editions.join(
		'</li>\n<li>'
	)}</li></ul>`

	// Add links
	return hydrateTextWithLinks(result)
}

// Define
export function getInstallInstructions(data: {
	filenamesForPackageFiles: FilenamesForPackageFiles
	name: string
	version: string
	main?: string
	browsers?: boolean
	module?: any
	dependencies: Record<string, string>
	devDependencies: Record<string, string>
	editions: Editions
	keywords: string[]
}): string {
	const parts = ['<h2>Install</h2>']

	// DocPad
	const prefix = 'docpad-plugin-'
	if (data.name.startsWith(prefix)) {
		const pluginName = data.name.substring(prefix.length)
		parts.push(
			`Install this DocPad plugin by entering <code>docpad install ${pluginName}</code> into your terminal.`
		)
	} else {
		// Node
		if (data.filenamesForPackageFiles.package) {
			parts.push(getNpmInstructions(data))

			// Browser
			if (data.browsers) {
				if (data.module) {
					parts.push(getPikaInstructions(data))
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

	return parts.join('\n\n')
}
