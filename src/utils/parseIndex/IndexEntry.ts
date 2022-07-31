export type IndexEntry = {
	ctime: number
	ctimeNano: number
	mtime: number
	mtimeNano: number
	dev: number
	ino: number
	mode: string
	uid: number
	gid: number
	fileSize: number
	sha: string
	flags: {
		base: string
		valid_flag: string
		extended_flag: string
		stage_flag: number
		file_name_length: number
	}
	fileName: string
	endingAt: number
}
