#!/usr/bin/env node

import { readFileSync } from "fs";
import { parseArgs } from "node:util";

import { parse as parseEnv } from "dotenv";

import { generateCodeFromEnvKeys } from "../src/generateCodeFromEnvKeys";

function bootstrap(): void {
    const { values: { outPath } } = parseArgs({
        options: {
            outPath: {
                type: "string",
                short: "o",
                default: "./src/env.d.ts"
            }
        }
    });

    // TODO support multiple env files (.env.development...)
    const envObj = parseEnv(
        readFileSync(".env")
    );

    generateCodeFromEnvKeys({ outPath: outPath!, envObj });
}

bootstrap();
