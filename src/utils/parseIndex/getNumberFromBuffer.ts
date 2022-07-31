export function getNumberFromBuffer(arrayBuffer: number[]) {
	return Number('0x' + Buffer.from(arrayBuffer).toString('hex'))
}
