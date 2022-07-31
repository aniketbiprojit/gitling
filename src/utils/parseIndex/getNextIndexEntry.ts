import { getNumberFromBuffer } from './getNumberFromBuffer'
import { getFlags } from './getFlags'

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
	const value = 62 + flags.file_name_length
	const endingAt = value + (8 - (value % 8))

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
