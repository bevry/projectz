import type { BadgesField } from 'badges'
import type Fellow from 'fellow'
import type { Edition } from 'editions'

export interface Link {
	url: string
	text: string
	title?: string
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

export type EnhancedReadmesData = DataForReadmeFiles

export interface EnhancedPackagesData {
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
	sponsor?: never
	sponsors: Fellow[]
	maintainer?: never
	maintainers: Fellow[]
	contributors: Fellow[]
	author?: string
	authors: Fellow[]
	license?: string
	licenses?: never
	browser?: any
	jspm?: any
	homepage?: string
	repository?: {
		url: string
	}
}

export interface EnhancedPackagesDataWithGitHub extends EnhancedPackagesData {
	github: Github
}
