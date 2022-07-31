import { readFileSync } from 'fs'
import { join } from 'path'

export const getNextIndexEntry = (entries: number[]) => {
	const ctime = getNumberFromBuffer(entries.slice(0, 4))
	const ctimeNano = getNumberFromBuffer(entries.slice(4, 8))
	const mtime = getNumberFromBuffer(entries.slice(8, 12))
	const mtimeNano = getNumberFromBuffer(entries.slice(12, 16))
	const dev = getNumberFromBuffer(entries.slice(16, 20))
	const ino = getNumberFromBuffer(entries.slice(20, 24))
	const mode = getNumberFromBuffer(entries.slice(24, 28)).toString(8)
	const uid = getNumberFromBuffer(entries.slice(28, 32))
	const gid = getNumberFromBuffer(entries.slice(32, 36))
	const fileSize = getNumberFromBuffer(entries.slice(36, 40))
	const sha = Buffer.from(entries.slice(40, 60)).toString('hex')
	const flags = getFlags(getNumberFromBuffer(entries.slice(60, 62)))
	const fileName = Buffer.from(entries.slice(62, 62 + flags.file_name_length)).toString()
	const value = 62 + flags.file_name_length + 1
	const endingAt = value % 8 !== 0 ? value + (8 - (value % 8)) : value

	console.log({ fileName })

	return {
		...[ctime, ctimeNano, mtime, mtimeNano, dev, ino, mode, uid, gid, fileSize, sha, flags, fileName, endingAt],
		ctime,
		ctimeNano,
		mtime,
		mtimeNano,
		dev,
		ino,
		mode,
		uid,
		gid,
		fileSize,
		sha,
		flags,
		fileName,
		endingAt,
	}
}

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
	while (endingAt < entries.slice(endingAt).length) {
		const data = getNextIndexEntry(entries.slice(endingAt))
		endingAt = data.endingAt
		entries = entries.slice(endingAt)
	}
	return { signature, version, numberOfEntries, entries }
}
function getFlags(base: number) {
	let baseEncoded = base.toString(2)
	baseEncoded = new Array(16 - baseEncoded.length).fill(0).join('') + baseEncoded
	const valid_flag = baseEncoded.slice(0, 1)
	const extended_flag = baseEncoded.slice(1, 2)
	const stage_flag = baseEncoded.slice(2, 4)
	const file_name_length = Number('0b' + baseEncoded.slice(4))
	return { base: baseEncoded, valid_flag, extended_flag, stage_flag, file_name_length }
}

function getNumberFromBuffer(arrayBuffer: number[]) {
	return Number('0x' + Buffer.from(arrayBuffer).toString('hex'))
}
