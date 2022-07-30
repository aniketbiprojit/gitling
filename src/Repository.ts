import { appendFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export class Repository {
    private _baseDir!: string;

    public init() {
        this._baseDir = __dirname;
        this._createDirectory("refs/heads")
        this._createDirectory("objects")
        this._createFile("", "./HEAD")
        return this;
    }

    public get baseDir(): string {
        return this._baseDir;
    }

    public get gitLingDir(): string {
        return join(this._baseDir, ".gitLing")
    }

    private _createDirectory(...args: string[]) {
        if (args.length === 0) {
            return
        }
        if (!existsSync(this.baseDir)) {
            throw new Error("Not a directory");
        }
        if (!existsSync(this.gitLingDir)) {
            mkdirSync(this.gitLingDir)
        }
        mkdirSync(join(this.gitLingDir, ...args), {
            recursive: true
        })
    }

    private _createFile(data: string | Uint8Array, ...args: string[]) {
        this._createDirectory(...args.slice(0, -1));

        appendFileSync(join(...args), data)

        return join(...args)
    }
}
