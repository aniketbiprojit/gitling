import { getNumberFromBuffer } from './getNumberFromBuffer'

export type TreeExtension = ReturnType<typeof parseTreeExtension>

export const getExtensionData = (extension: number[]) => {
	const signature = String.fromCharCode(...extension.slice(0, 4))
	const length = getNumberFromBuffer(extension.slice(4, 8))

	const return_data: { trees: TreeExtension[] } = { trees: [] }

	if (signature === 'TREE') {
		console.log(`${signature} ${length}`)
		extension = extension.slice(8)
		let tree_length = 8
		const trees = []
		while (extension.slice(tree_length).length !== 0) {
			const tree = parseTreeExtension(extension.slice(tree_length))
			trees.push(tree)
			tree_length += tree.totalLength
		}
		return_data['trees'] = trees
	}
	return return_data
}

function parseTreeExtension(extension: number[]) {
	const ascii = String.fromCharCode(...extension)
	const pathName = String.fromCharCode(...extension.slice(0, ascii.indexOf('\0')))
	const stringNumberOfEntries = String.fromCharCode(...extension.slice(pathName.length + 1, ascii.indexOf(' ')))

	const numberOfSubtreesString = String.fromCharCode(
		...extension.slice(stringNumberOfEntries.length + pathName.length + 1, ascii.indexOf('\n'))
	)
	const hashFrom = numberOfSubtreesString.length + stringNumberOfEntries.length + pathName.length + 2
	const sha = Buffer.from(extension.slice(hashFrom, hashFrom + 20)).toString('hex')
	return {
		numberOfEntries: Number(stringNumberOfEntries),
		numberOfSubtrees: Number(numberOfSubtreesString),
		pathName,
		totalLength: hashFrom + 20,
		sha,
	}
}
