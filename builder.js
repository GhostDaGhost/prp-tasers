const esbuild = require("esbuild");
const glob = require("glob");
const IS_WATCH_MODE = process.env.IS_WATCH_MODE;

const TARGET_ENTRIES = [
    {
        target: "node16",
        entryPoints: glob.sync('./src/server/**/*.ts'),
        platform: "node",
        outdir: "./build/server"
    },
    {
        target: "es2020",
        entryPoints: glob.sync('./src/client/**/*.ts'),
        outdir: "./build/client"
    }
];

const buildBundle = async () => {
    try {
        const baseOptions = {
            logLevel: "info",
            bundle: true,
            charset: "utf8",
            minifyWhitespace: true,
            absWorkingDir: process.cwd()
        };

        for (const targetOpts of TARGET_ENTRIES) {
            const mergedOpts = {
                ...baseOptions,
                ...targetOpts
            };


            if (IS_WATCH_MODE) {
                mergedOpts.watch = {
                    onRebuild(error) {
                        if (error)
                            console.error(`[ESBuild Watch] (${targetOpts.entryPoints[0]}) Failed to rebuild bundle`);
                        else
                            console.log(`[ESBuild Watch] (${targetOpts.entryPoints[0]}) Sucessfully rebuilt bundle`);
                    },
                };
            }

            const { errors } = await esbuild.build(mergedOpts);
            if (errors.length) {
                console.error(`[ESBuild] Bundle failed with ${errors.length} errors`);
                process.exit(1);
            }
        }
    } catch (e) {
        console.log("[ESBuild] Build failed with error");
        console.error(e);
        process.exit(1);
    }
};

buildBundle().catch(() => process.exit(1));
