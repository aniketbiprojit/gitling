#!/usr/bin/env node

import { existsSync, statSync } from 'fs'
import { basename } from 'path'
import { Repository } from './Repository'
import { CLIException } from './utils/CLIException'
import { createBlob } from './utils/createBlob'
import { hashObject } from './utils/hashObject'
import { getStatus } from './utils/lsFiles/getStatus'
import { IndexEntry } from './utils/parseIndex/IndexEntry'
import { parseIndex } from './utils/parseIndex/parseIndex'
import { version } from '../package.json'

export { hashObject, parseIndex, updateIndex, getStatus, createBlob, CLIException, IndexEntry }

const repo = new Repository()
const args = process.argv.slice(2)
try {
	switch (args?.[0]) {
		case '--version':
			console.log(`GitLing version: v${version}`)
			break
		case 'init':
			repo.init()
			break
		case 'hash-object':
			console.log(hashObject({ objectType: 'blob', data: args?.[1] }))
			break
		case 'create-blob':
			const { sha } = createBlob(repo, ...args.slice(1))
			updateIndex(repo, sha, ...args.slice(1))
			break

		case 'get-status':
			getStatus(true, ...args.slice(1))
			break

		case 'parse-index':
			if (args.slice(1).length === 0) {
				parseIndex(true, '.git/index')
			} else parseIndex(true, ...args.slice(1), '.git/index')

			break

		default:
			throw new CLIException('Not a command', 'index')
	}
} catch (err) {
	if (err instanceof CLIException) {
		err.logError()
	} else {
		console.error(err)
	}
	process.exit(1)
}

function updateIndex(repo: Repository, sha: string, ...filePath: string[]) {
	const indexPath = repo.getFile('.git', 'index')
	const completePath = repo.getFile(...filePath)

	let indexData: ReturnType<typeof parseIndex> = {} as any
	if (existsSync(indexPath)) {
		indexData = parseIndex(false, indexPath)
		console.log({ indexData: indexData.indexEntryData[1] })
	} else {
		indexData.signature = 'DIRC'
		indexData.version = 2
		indexData.numberOfEntries = 1

		indexData.indexEntryData = []
		indexData.extension_exists = false
		indexData.extension_entries = { trees: [] }
		indexData.fileSha = ''
		indexData.file_sha_data = ''
	}

	const indexEntryData: IndexEntry = {} as any

	const stats = statSync(indexPath)
	indexEntryData.ctime = Math.floor(stats.ctimeMs / 1000)
	indexEntryData.ctimeNano = ((stats.ctimeMs * 1000) % 1000000) * 1000

	indexEntryData.mtime = Math.floor(stats.mtimeMs / 1000)
	indexEntryData.mtimeNano = ((stats.mtimeMs * 1000) % 1000000) * 1000

	indexEntryData.dev = stats.dev
	indexEntryData.ino = stats.ino
	indexEntryData.mode = stats.mode.toString(8)
	indexEntryData.uid = stats.uid
	indexEntryData.gid = stats.gid
	indexEntryData.fileSize = stats.size

	indexEntryData.sha = sha

	indexEntryData.flags = {
		base: '',
		valid_flag: '',
		extended_flag: '',
		stage_flag: 0,
		file_name_length: basename(completePath).length,
	}

	indexEntryData.fileName = basename(completePath)

	return { repo, sha, args: filePath }
}
