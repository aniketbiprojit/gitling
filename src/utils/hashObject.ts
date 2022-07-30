export const hashObject = ({ repo_path, sha }: { repo_path: string; sha: string; }) => {
    return { repo_path, sha }
}