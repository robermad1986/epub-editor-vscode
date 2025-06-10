export type UnistPoint = {
    /**
     * Column in a source file (1-indexed integer).
     */
    column: number;

    /**
     * Line in a source file (1-indexed integer).
     */
    line: number;

    /**
     * Character in a source file (0-indexed integer).
     */
    offset?: number;
};

export type UnistPosition = {
    /**
     * Place of the first character of the parsed source region.
     */
    start: UnistPoint;

    /**
     * Place of the first character after the parsed source region.
     */
    end: UnistPoint;

    /**
     * Start column at each index (plus start line) in the source region,
     * for elements that span multiple lines.
     */
    indent?: number[];
};

export type UnistNode = {
    /**
     * The variant of a node.
     */
    type: string;

    /**
     * Information from the ecosystem.
     */
    data?: unknown | undefined;
    /**
     * Location of a node in a source document.
     * Must not be present if a node is generated.
     */
    position?: UnistPosition | undefined;
};
