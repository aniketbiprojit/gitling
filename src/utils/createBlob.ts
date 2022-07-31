import { readFileSync } from 'fs'
import { deflateSync } from 'zlib'
import { Repository } from '../Repository'
import { getShaPath } from './getShaPath'
import { hashObject } from './hashObject'

export const createBlob = (repo: Repository, ...filePath: string[]) => {
	const completePath = repo.getFile(...filePath)
	const data = readFileSync(completePath).toString()
	const compressed = deflateSync(data)
	const sha = hashObject({ data: data.toString(), objectType: 'blob' })
	repo.writeFile(compressed, 'objects', ...getShaPath(sha))
	return { sha }
}
