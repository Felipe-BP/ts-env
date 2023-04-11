import ts from "typescript";
import { writeFileSync } from "node:fs";

type Params = {
    outPath: string;
    envObj: Record<string, string>;
}

export function generateCodeFromEnvKeys({ outPath, envObj }: Params): void {
    const outFile = ts.createSourceFile(outPath!, "", ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

    const nodes = Object.keys(envObj).map(envKey => ts.factory.createPropertyDeclaration(
        [],
        envKey,
        undefined,
        ts.factory.createUnionTypeNode([
            ts.factory.createTypeReferenceNode("string"),
            ts.factory.createTypeReferenceNode("undefined"),
        ]),
        undefined
    ));

    const interfaceDecl = ts.factory.createInterfaceDeclaration(
        undefined,
        "ProcessEnv",
        undefined,
        undefined,
        nodes as any,
    );

    const declareModifier = ts.factory.createModifier(ts.SyntaxKind.DeclareKeyword);
    const nodeJSNamespaceBlock = ts.factory.createModuleBlock([interfaceDecl]);
    const nodeJSNamespaceDecl = ts.factory.createModuleDeclaration(
        [declareModifier],
        ts.factory.createIdentifier("NodeJS"),
        nodeJSNamespaceBlock,
        ts.NodeFlags.Namespace
    );

    const result = printer.printNode(ts.EmitHint.Unspecified, nodeJSNamespaceDecl, outFile);

    writeFileSync(outPath!, result, { flag: 'w' });
}
