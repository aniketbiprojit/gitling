#!/usr/bin/env node

import { Repository } from './Repository'
import { CLIException } from './utils/CLIException'
import { hashObject } from './utils/hashObject'

const repo = new Repository()
const args = process.argv.slice(2)
try {
	switch (args?.[0]) {
		case 'init':
			repo.init()
			break
		case 'hash-object':
			console.log(hashObject({ objectType: 'blob', data: args?.[1] }))
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
}
