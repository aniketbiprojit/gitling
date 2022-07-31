import { readFileSync } from 'fs'
import { join } from 'path'
import { getNextIndexEntry } from './getNextIndexEntry'
import * as crypto from 'crypto'
import assert from 'assert'

export const parseIndex = (...absoluteFilepath: string[]) => {
	const arrayBuffer = readFileSync(join(...absoluteFilepath)).toJSON().data
	const signature = String.fromCharCode(...arrayBuffer.slice(0, 4).map((elem) => Number(elem)))
	const version = arrayBuffer
		.slice(4, 8)
		.map((elem) => Number(elem))
		.reduce((a, b) => a + b, 0)
	const numberOfEntries = getNumberFromBuffer(arrayBuffer.slice(8, 12))
	let entries = arrayBuffer.slice(12)
	let endingAt = 0
	let totalEnding = 0
	const indexData = []
	for (let index = 0; index < numberOfEntries; index++) {
		const data = getNextIndexEntry(entries)
		console.log(data.fileName)
		endingAt = data.endingAt
		totalEnding += endingAt
		entries = entries.slice(endingAt)
		indexData.push(data)
	}

	let extension_exists = false

	const leftOverEntries = arrayBuffer.slice(totalEnding)

	let extension_data: number[] = []

	if (leftOverEntries.length > 20) {
		extension_data = arrayBuffer.slice(totalEnding, -20)
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
		entries,
		fileSha,
		indexData,
		file_sha_data,
		extension_exists,
		extension_data,
	}
}

export function getFlags(base: number) {
	let baseEncoded = base.toString(2)
	baseEncoded = new Array(16 - baseEncoded.length).fill(0).join('') + baseEncoded
	const valid_flag = baseEncoded.slice(0, 1)
	const extended_flag = baseEncoded.slice(1, 2)
	const stage_flag = baseEncoded.slice(2, 4)
	const file_name_length = Number('0b' + baseEncoded.slice(4))
	return { base: baseEncoded, valid_flag, extended_flag, stage_flag, file_name_length }
}

export function getNumberFromBuffer(arrayBuffer: number[]) {
	return Number('0x' + Buffer.from(arrayBuffer).toString('hex'))
}
