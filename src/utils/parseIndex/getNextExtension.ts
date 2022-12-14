export type TreeExtension = ReturnType<typeof parseTreeExtension>

export const getExtensionData = (log = false, extension: number[]) => {
	const signature = String.fromCharCode(...extension.slice(0, 4))
	const return_data: { trees: TreeExtension[] } = { trees: [] }

	if (signature === 'TREE') {
		let tree_length = 8
		const trees = []

		while (extension.slice(tree_length).length !== 0) {
			const tree = parseTreeExtension(extension.slice(tree_length))
			trees.push(tree)
			tree_length += tree.totalLength
		}
		return_data['trees'] = trees
		if (log) {
			console.log(signature)
			trees.map((elem) => {
				console.log(`${elem.sha} ${elem.numberOfEntries} ${elem.numberOfSubtrees} ${elem.pathName}`)
			})
		}
	} else {
		console.log({ signature })
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
		totalLength: stringNumberOfEntries === '-1' ? hashFrom : hashFrom + 20,
		sha: stringNumberOfEntries === '-1' ? 'Invalid SHA' : sha,
	}
}
