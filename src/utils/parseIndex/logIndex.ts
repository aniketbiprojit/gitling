import { IndexEntry } from './IndexEntry'

export const logIndex = (entry: IndexEntry) => {
	console.log(`${entry.mode} ${entry.sha} ${entry.flags.stage_flag} ${entry.fileName}`)
}
