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

	public height: number

	private _parentNode: TreeNode | undefined
	public get parentNode(): TreeNode | undefined {
		return this._parentNode
	}
	public set parentNode(value: TreeNode | undefined) {
		this._parentNode = value
	}

	constructor({
		sha,
		children = [],
		numberOfSubtrees = 0,
		pathName,
		height = 0,
		parentNode,
	}: {
		sha: string
		children?: TreeNode[]
		numberOfSubtrees?: number
		pathName: string
		height: number
		parentNode?: TreeNode
	}) {
		this.sha = sha
		this.children = children
		this.numberOfSubtrees = numberOfSubtrees
		this.pathName = pathName

		this.height = height

		this.parentNode = parentNode
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
				height: 0,
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
	}[],
	parentNode?: TreeNode
): TreeNode => {
	const node = nodes[index]
	if (node.numberOfSubtrees > 0) {
		const children: TreeNode[] = []
		let nextIndex = index + 1

		const currentNode = new TreeNode({
			height: children.reduce((a, b) => a + b.height, 1),
			pathName: node.pathName,
			sha: node.sha,
			children,
			numberOfSubtrees: node.numberOfSubtrees,
		})

		for (let i = 0; i < node.numberOfSubtrees; i++) {
			const childNode = constructNode(nextIndex, nodes, currentNode)
			nextIndex += childNode.height
			children.push(childNode)
		}

		currentNode.height = children.reduce((a, b) => a + b.height, 1)
		currentNode.children = children
		currentNode.parentNode = parentNode
		return currentNode
	}
	return new TreeNode({ sha: node.sha, pathName: node.pathName, height: 1, parentNode })
}

const logTree = (node: TreeNode | Tree, space = '') => {
	if (node instanceof Tree) {
		node = node.root
	}
	console.log(space, (node.pathName || '.') + `(${(node.parentNode?.height ?? 0) - node.height})`)

	if (node.children.length > 0) {
		space += '  '
		for (let index = 0; index < node.children.length; index++) {
			const child = node.children[index]
			logTree(child, space)
		}
	}
}
