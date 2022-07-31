export const getShaPath: (sha: string) => [string, string] = (sha) => {
	return [sha.slice(0, 2), sha.slice(2)]
}
