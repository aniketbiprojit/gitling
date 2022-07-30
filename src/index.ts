#!/usr/bin/env node

import { Repository } from "./Repository";
import { hashObject } from "./utils/hashObject";

const repo = new Repository().init()

hashObject({ repo_path: repo.baseDir, sha: "" })