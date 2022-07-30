import * as crypto from 'crypto'
import { CLIException } from './CLIException'
type ObjectType = 'blob'

export const hashObject = ({ data, objectType }: { data: string; objectType: ObjectType }) => {
	if (!data) {
		throw new CLIException('Nothing to hash', __filename)
	}
	const dataToHash = `${objectType} ${data.length + 1}\0${data}\n`
	const hash = crypto.createHash('sha1').update(dataToHash).digest('hex')
	return hash
}
