import { parseIndex } from '../parseIndex/parseIndex'

export const getStatus = (log = false, ...absoluteFilepath: string[]) => {
	constructTree(true, ...absoluteFilepath)
	if (log) {
		log
	}
}

class TreeNode {
	children: TreeNode[]
	public numberOfSubtrees: number = 0
	public sha: string

	public pathName: string

	public depth: number

	constructor({
		sha,
		children = [],
		numberOfSubtrees = 0,
		pathName,
		depth = 0,
	}: {
		sha: string
		children?: TreeNode[]
		numberOfSubtrees?: number
		pathName: string
		depth: number
	}) {
		this.sha = sha
		this.children = children
		this.numberOfSubtrees = numberOfSubtrees
		this.pathName = pathName

		this.depth = depth
	}

	updateChildren(node: TreeNode) {
		this.children.push(node)
	}
}

class Tree {
	public root: TreeNode

	constructor(root: TreeNode) {
		this.root = root
	}
}

const constructTree = (log = false, ...absoluteFilepath: string[]) => {
	const {
		extension_entries: { trees },
	} = parseIndex(false, ...absoluteFilepath, '.git/index')

	if (trees[0].numberOfEntries === -1) {
		console.log('Invalid tree root')
		// construct tree from index after a dir walk
		return new Tree(
			new TreeNode({
				depth: 0,
				sha: '',
				pathName: '',
			})
		)
	} else {
		const tree = constructNode(0, trees)
		if (log === true) logTree(tree)
		return new Tree(tree)
	}
}

const constructNode = (
	index: number = 0,
	nodes: {
		numberOfEntries: number
		numberOfSubtrees: number
		pathName: string
		totalLength: number
		sha: string
	}[]
): TreeNode => {
	const node = nodes[index]
	if (node.numberOfSubtrees > 0) {
		const children = []
		let nextIndex = index + 1
		for (let i = 0; i < node.numberOfSubtrees; i++) {
			const childNode = constructNode(nextIndex, nodes)
			nextIndex += childNode.depth
			children.push(childNode)
		}
		return new TreeNode({
			depth: children.reduce((a, b) => a + b.depth, 1),
			pathName: node.pathName,
			sha: node.sha,
			children,
			numberOfSubtrees: node.numberOfSubtrees,
		})
	}
	return new TreeNode({ sha: node.sha, pathName: node.pathName, depth: 1 })
}

const logTree = (node: TreeNode | Tree, space = '') => {
	if (node instanceof Tree) {
		node = node.root
	}
	console.log(space, node.pathName || '.', node.depth)

	if (node.children.length > 0) {
		space += ' '
		for (let index = 0; index < node.children.length; index++) {
			const child = node.children[index]
			logTree(child, space)
		}
	}
}
