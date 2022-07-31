export function getFlags(base: number) {
	let baseEncoded = base.toString(2)
	baseEncoded = new Array(16 - baseEncoded.length).fill(0).join('') + baseEncoded
	const valid_flag = baseEncoded.slice(0, 1)
	const extended_flag = baseEncoded.slice(1, 2)
	const stage_flag = Number(baseEncoded.slice(2, 4))
	const file_name_length = Number('0b' + baseEncoded.slice(4))
	return { base: baseEncoded, valid_flag, extended_flag, stage_flag, file_name_length }
}
