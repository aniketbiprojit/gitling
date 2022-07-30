import { readFileSync } from 'fs'
import { deflateSync } from 'zlib'
import { Repository } from '../Repository'
import { hashObject } from './hashObject'

export const createBlob = (repo: Repository, ...filePath: string[]) => {
	const completePath = repo.getFile(...filePath)
	const data = readFileSync(completePath).toString()
	const compressed = deflateSync(data)
	const sha = hashObject({ data: data.toString(), objectType: 'blob' })
	repo.writeFile(compressed, 'objects', sha.slice(0, 2), sha.slice(2))
	return { sha }
}
