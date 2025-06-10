import { TxtNode } from "@textlint/ast-node-types";
import { UnistNode } from "./UnistNode";

export type StringSourceReplacerMaskValueCommand = {
    type: "StringSourceReplacerMaskValueCommand";
    maskSymbol: string;
};
export type StringSourceReplacerEmptyValueCommand = {
    type: "StringSourceReplacerEmptyValueCommand";
};

export type StringSourceReplacerCommand = StringSourceReplacerMaskValueCommand | StringSourceReplacerEmptyValueCommand;

export const maskValue = (maskSymbol: string): StringSourceReplacerMaskValueCommand => {
    if (maskSymbol.length !== 1) {
        throw new Error("maskSymbol should be single character");
    }
    return {
        type: "StringSourceReplacerMaskValueCommand",
        maskSymbol
    };
};
export const emptyValue = (): StringSourceReplacerEmptyValueCommand => {
    return {
        type: "StringSourceReplacerEmptyValueCommand"
    };
};

export const handleReplacerCommand = <T extends TxtNode | UnistNode>(
    command: StringSourceReplacerCommand,
    node: T
): T => {
    if (!command) {
        return node;
    }
    if (command.type === "StringSourceReplacerEmptyValueCommand") {
        if (!("value" in node)) {
            return node;
        }
        return {
            ...node,
            value: ""
        };
    } else if (command.type === "StringSourceReplacerMaskValueCommand") {
        if (!("value" in node) || typeof node.value !== "string") {
            throw new Error(
                `Can not masking. ${node.type} node does not have value property: ` + JSON.stringify(node, null, 4)
            );
        }
        return {
            ...node,
            value: command.maskSymbol.repeat(node.value.length)
        };
    }
    throw new Error(`Unknown command: ${JSON.stringify(command as never)}`);
};
