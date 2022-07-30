import * as crypto from 'crypto'
export const hashObject = (data: string) => {
    const dataToHash = `blob ${data.length + 1}\0${data}\n`
    console.log({ dataToHash })
    const hash = crypto.createHash('sha1').update(dataToHash).digest('hex')
    console.log(hash)
    return hash

}