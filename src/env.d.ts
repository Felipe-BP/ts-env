declare namespace NodeJS {
    interface ProcessEnv {
        DATABASE_URL: string | undefined;
        TZ: string | undefined;
        TEST: string | undefined;
    }
}