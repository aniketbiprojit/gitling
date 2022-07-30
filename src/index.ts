#!/usr/bin/env node

import { Repository } from "./Repository";
import { hashObject } from "./utils/hashObject";

const repo = new Repository().init()
    ; (repo.gitLingDir)
hashObject("data")