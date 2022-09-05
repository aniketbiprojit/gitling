import { readFileSync } from 'fs'
import { join } from 'path'
import { getNextIndexEntry } from './getNextIndexEntry'
import * as crypto from 'crypto'
import assert from 'assert'
import { logIndex } from './logIndex'
import { getNumberFromBuffer } from './getNumberFromBuffer'
import { getExtensionData } from './getNextExtension'
import { IndexEntry } from './IndexEntry'

export const parseIndex = (log = false, ...absoluteFilepath: string[]) => {
	const arrayBuffer = readFileSync(join(...absoluteFilepath)).toJSON().data
	console.log(arrayBuffer.length)
	const signature = String.fromCharCode(...arrayBuffer.slice(0, 4).map((elem) => Number(elem)))
	const version = arrayBuffer
		.slice(4, 8)
		.map((elem) => Number(elem))
		.reduce((a, b) => a + b, 0)
	const numberOfEntries = getNumberFromBuffer(arrayBuffer.slice(8, 12))
	let entries = arrayBuffer.slice(12)
	let endingAt = 0
	let totalEnding = 12
	const indexEntryData: IndexEntry[] = []
	for (let index = 0; index < numberOfEntries; index++) {
		const data = getNextIndexEntry(entries)
		endingAt = data.endingAt
		totalEnding += endingAt
		entries = entries.slice(endingAt)
		indexEntryData.push(data)
	}

	if (log) indexEntryData.forEach((elem) => logIndex(elem))

	let extension_exists = false

	const leftOverEntries = arrayBuffer.slice(totalEnding)

	let extension_data: number[] = []
	let extension_entries: ReturnType<typeof getExtensionData> = { trees: [] }
	if (leftOverEntries.length > 20) {
		extension_data = arrayBuffer.slice(totalEnding, -20)
		extension_entries = getExtensionData(log, extension_data)
		extension_exists = true
	}
	const file_sha_data = Buffer.from(leftOverEntries.slice(-20)).toString('hex')
	const fileSha = crypto
		.createHash('sha1')
		.update(Buffer.from(arrayBuffer.slice(0, -20)))
		.digest('hex')

	assert.equal(fileSha, file_sha_data, 'File SHA does not match')

	return {
		signature,
		version,
		numberOfEntries,
		indexEntryData,
		extension_exists,
		extension_data,
		extension_entries,
		fileSha,
		file_sha_data,
	}
}
