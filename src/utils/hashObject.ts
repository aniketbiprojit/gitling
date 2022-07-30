import * as crypto from 'crypto'
export const hashObject = (data: string) => {
    const dataToHash = `blob ${data.length + 1}\0${data}\n`
    const hash = crypto.createHash('sha1').update(dataToHash).digest('hex')
    return hash
}