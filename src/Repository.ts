import { appendFileSync, existsSync, mkdirSync } from "fs";
import { stringify as iniStringify } from "ini";
import { join } from "path";

export class Repository {
    private _baseDir!: string;

    public init() {
        this._baseDir = join(__dirname, "..");
        this._createDirectory("refs/heads")
        this._createDirectory("objects")
        this._createFile("", "HEAD")
        this._createFile(this._default_config(), "config")
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

        const filePath = join(this.gitLingDir, ...args);
        if (existsSync(filePath)) {
            return filePath
        }
        appendFileSync(filePath, data)

        return filePath
    }

    private _default_config() {
        const core = {
            repositoryformatversion: '0',
            filemode: true,
            bare: false,
            logallrefupdates: true,
            ignorecase: true,
            precomposeunicode: true
        }
        const user = { email: "aniket_chowdhury@hotmail.com", name: "Aniket Biprojit Chowdhury" }
        const iniString = iniStringify({ core, user }, { whitespace: true }).split("\n").map(elem => {
            if (elem.startsWith("[")) return elem
            else elem = "    " + elem
            return elem
        }).join('\n')
        return (iniString);
    }
}
