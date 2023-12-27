// external
import type { BadgesField } from 'badges'
import type { Fellow } from '@bevry/github-api'
import type { Edition } from 'editions'

export interface LicenseOptions {
	license?: string
	authors: Fellow[]
}

export interface LicenseConfig extends LicenseOptions {
	license: string
}

export interface BackerOptions {
	filenamesForReadmeFiles: FilenamesForReadmeFiles
	badges: BadgesField

	author: Fellow[]
	authors: Fellow[]
	maintainers: Fellow[]
	contributors: Fellow[]

	funders: Fellow[]
	sponsors: Fellow[]
	donors: Fellow[]

	github: Github
}

export interface Github {
	username: string
	repository: string
	slug: string
	url: string
	repositoryUrl: string
}

export interface FilenamesForPackageFiles {
	[key: string]: string | null
	projectz: string | null
	package: string | null
	bower: string | null
	component: string | null
	jquery: string | null
}

export interface DataForPackageFiles {
	[key: string]: Record<string, any>
}

export interface FilenamesForReadmeFiles {
	[key: string]: string | null
	readme: string | null
	history: string | null
	contributing: string | null
	backers: string | null
	license: string | null
}

export interface DataForReadmeFiles {
	[key: string]: string
}

export interface PackageEnhanced {
	name?: string
	version?: string
	license?: string
	description?: string
	keywords?: string[]
	author?: string
	maintainers?: string[]
	contributors?: string[]
	bugs?: {
		url: string
	}
	repository?: {
		type: string
		url: string
	}
	engines?: Record<string, string>
	dependencies?: Record<string, string>
	devDependencies?: Record<string, string>
	main?: string
}

export interface ComponentEnhanced {
	name?: string
	version?: string
	license?: string
	description?: string
	keywords?: string[]
	demo?: string
	main?: string
	scripts?: string
}

export interface BowerEnhanced {
	name?: string
	version?: string
	license?: string
	description?: string
	keywords?: string[]
	authors?: string[]
	main?: string
}

export type Editions = Edition[]

export type EnhancedReadmeData = DataForReadmeFiles

export interface EnhancedPackageData {
	[key: string]: any
	filenamesForPackageFiles: FilenamesForPackageFiles
	filenamesForReadmeFiles: FilenamesForReadmeFiles

	component: ComponentEnhanced
	bower: BowerEnhanced
	jquery: Record<string, any>
	package: PackageEnhanced
	projectz: Record<string, any>
	packages: Record<string, any>

	// merged / enhanced
	name: string
	title: string
	version: string
	description: string
	dependencies: Record<string, string>
	devDependencies: Record<string, string>
	badges: BadgesField
	keywords: string[]
	browsers: boolean
	editions: Edition[]
	github?: Github

	author: Fellow[]
	authors: Fellow[]
	maintainer?: never
	maintainers: Fellow[]
	contributor?: never
	contributors: Fellow[]

	funder?: never
	funders: Fellow[]
	sponsor?: never
	sponsors: Fellow[]
	donor?: never
	donors: Fellow[]

	license?: string
	licenses?: never
	browser?: any
	jspm?: any
	homepage?: string
	repository?: {
		url: string
	}
}

export interface EnhancedPackageDataWithGitHub extends EnhancedPackageData {
	github: Github
}
