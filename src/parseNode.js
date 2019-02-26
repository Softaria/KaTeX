// @flow
import {NON_ATOMS} from "./symbols";
import type SourceLocation from "./SourceLocation";
import type {AlignSpec} from "./environments/array";
import type {Atom} from "./symbols";
import type {Mode, StyleStr} from "./types";
import type {Token} from "./Token";
import type {Measurement} from "./units";

export type NodeType = $Keys<ParseNodeTypes>;
export type ParseNode<TYPE: NodeType> = $ElementType<ParseNodeTypes, TYPE>;

// ParseNode's corresponding to Symbol `Group`s in symbols.js.
export type SymbolParseNode =
    ParseNode<"atom"> |
    ParseNode<"accent-token"> |
    ParseNode<"mathord"> |
    ParseNode<"op-token"> |
    ParseNode<"spacing"> |
    ParseNode<"textord">;

// Union of all possible `ParseNode<>` types.
export type AnyParseNode = $Values<ParseNodeTypes>;

// Map from `NodeType` to the corresponding `ParseNode`.
type ParseNodeTypes = {
    "array": {|
        type: "array",
        mode: Mode,
        loc?: ?SourceLocation,
        hskipBeforeAndAfter?: boolean,
        addJot?: boolean,
        cols?: AlignSpec[],
        arraystretch: number,
        body: AnyParseNode[][], // List of rows in the (2D) array.
        rowGaps: (?Measurement)[],
        hLinesBeforeRow: Array<boolean[]>,
        attributes?: {[name: string]: string},
    |},
    "color": {|
        type: "color",
        mode: Mode,
        loc?: ?SourceLocation,
        color: string,
        body: AnyParseNode[],
        attributes?: {[name: string]: string},
    |},
    "color-token": {|
        type: "color-token",
        mode: Mode,
        loc?: ?SourceLocation,
        color: string,
        attributes?: {[name: string]: string},
    |},
    "keyVals": {|
        type: "keyVals",
        mode: Mode,
        loc?: ?SourceLocation,
        keyVals: string,
        attributes?: {[name: string]: string},
    |},
    // To avoid requiring run-time type assertions, this more carefully captures
    // the requirements on the fields per the op.js htmlBuilder logic:
    // - `body` and `value` are NEVER set simultanouesly.
    // - When `symbol` is true, `body` is set.
    "op": {|
        type: "op",
        mode: Mode,
        loc?: ?SourceLocation,
        limits: boolean,
        alwaysHandleSupSub?: boolean,
        suppressBaseShift?: boolean,
        symbol: boolean,
        name: string,
        body?: void,
        attributes?: {[name: string]: string},
    |} | {|
        type: "op",
        mode: Mode,
        loc?: ?SourceLocation,
        limits: boolean,
        alwaysHandleSupSub?: boolean,
        suppressBaseShift?: boolean,
        symbol: false,  // If 'symbol' is true, `body` *must* be set.
        name?: void,
        body: AnyParseNode[],
        attributes?: {[name: string]: string},
    |},
    "ordgroup": {|
        type: "ordgroup",
        mode: Mode,
        loc?: ?SourceLocation,
        body: AnyParseNode[],
        semisimple?: boolean,
        attributes?: {[name: string]: string},
    |},
    "raw": {|
        type: "raw",
        mode: Mode,
        loc?: ?SourceLocation,
        string: string,
        attributes?: {[name: string]: string},
    |},
    "size": {|
        type: "size",
        mode: Mode,
        loc?: ?SourceLocation,
        value: Measurement,
        isBlank: boolean,
        attributes?: {[name: string]: string},
    |},
    "styling": {|
        type: "styling",
        mode: Mode,
        loc?: ?SourceLocation,
        style: StyleStr,
        body: AnyParseNode[],
        attributes?: {[name: string]: string},
    |},
    "supsub": {|
        type: "supsub",
        mode: Mode,
        loc?: ?SourceLocation,
        base: ?AnyParseNode,
        sup?: ?AnyParseNode,
        sub?: ?AnyParseNode,
        attributes?: {[name: string]: string},
    |},
    "tag": {|
        type: "tag",
        mode: Mode,
        loc?: ?SourceLocation,
        body: AnyParseNode[],
        tag: AnyParseNode[],
        attributes?: {[name: string]: string},
    |},
    "text": {|
        type: "text",
        mode: Mode,
        loc?: ?SourceLocation,
        body: AnyParseNode[],
        font?: string,
        attributes?: {[name: string]: string},
    |},
    "url": {|
        type: "url",
        mode: Mode,
        loc?: ?SourceLocation,
        url: string,
        attributes?: {[name: string]: string},
    |},
    "verb": {|
        type: "verb",
        mode: Mode,
        loc?: ?SourceLocation,
        body: string,
        star: boolean,
        attributes?: {[name: string]: string},
    |},
    // From symbol groups, constructed in Parser.js via `symbols` lookup.
    // (Some of these have "-token" suffix to distinguish them from existing
    // `ParseNode` types.)
    "atom": {|
        type: "atom",
        family: Atom,
        mode: Mode,
        loc?: ?SourceLocation,
        text: string,
        attributes?: {[name: string]: string},
    |},
    "mathord": {|
        type: "mathord",
        mode: Mode,
        loc?: ?SourceLocation,
        text: string,
        attributes?: {[name: string]: string},
    |},
    "spacing": {|
        type: "spacing",
        mode: Mode,
        loc?: ?SourceLocation,
        text: string,
        attributes?: {[name: string]: string},
    |},
    "textord": {|
        type: "textord",
        mode: Mode,
        loc?: ?SourceLocation,
        text: string,
        attributes?: {[name: string]: string},
    |},
    // These "-token" types don't have corresponding HTML/MathML builders.
    "accent-token": {|
        type: "accent-token",
        mode: Mode,
        loc?: ?SourceLocation,
        text: string,
        attributes?: {[name: string]: string},
    |},
    "op-token": {|
        type: "op-token",
        mode: Mode,
        loc?: ?SourceLocation,
        text: string,
        attributes?: {[name: string]: string},
    |},
    // From functions.js and functions/*.js. See also "color", "op", "styling",
    // and "text" above.
    "accent": {|
        type: "accent",
        mode: Mode,
        loc?: ?SourceLocation,
        label: string,
        isStretchy?: boolean,
        isShifty?: boolean,
        base: AnyParseNode,
        attributes?: {[name: string]: string},
    |},
    "accentUnder": {|
        type: "accentUnder",
        mode: Mode,
        loc?: ?SourceLocation,
        label: string,
        isStretchy?: boolean,
        isShifty?: boolean,
        base: AnyParseNode,
        attributes?: {[name: string]: string},
    |},
    "cr": {|
        type: "cr",
        mode: Mode,
        loc?: ?SourceLocation,
        newRow: boolean,
        newLine: boolean,
        size: ?Measurement,
        attributes?: {[name: string]: string},
    |},
    "delimsizing": {|
        type: "delimsizing",
        mode: Mode,
        loc?: ?SourceLocation,
        size: 1 | 2 | 3 | 4,
        mclass: "mopen" | "mclose" | "mrel" | "mord",
        delim: string,
        attributes?: {[name: string]: string},
    |},
    "enclose": {|
        type: "enclose",
        mode: Mode,
        loc?: ?SourceLocation,
        label: string,
        backgroundColor?: string,
        borderColor?: string,
        body: AnyParseNode,
        attributes?: {[name: string]: string},
    |},
    "environment": {|
        type: "environment",
        mode: Mode,
        loc?: ?SourceLocation,
        name: string,
        nameGroup: AnyParseNode,
        attributes?: {[name: string]: string},
    |},
    "font": {|
        type: "font",
        mode: Mode,
        loc?: ?SourceLocation,
        font: string,
        body: AnyParseNode,
        attributes?: {[name: string]: string},
    |},
    "genfrac": {|
        type: "genfrac",
        mode: Mode,
        loc?: ?SourceLocation,
        continued: boolean,
        numer: AnyParseNode,
        denom: AnyParseNode,
        hasBarLine: boolean,
        leftDelim: ?string,
        rightDelim: ?string,
        size: StyleStr | "auto",
        barSize: Measurement | null,
        attributes?: {[name: string]: string},
    |},
    "horizBrace": {|
        type: "horizBrace",
        mode: Mode,
        loc?: ?SourceLocation,
        label: string,
        isOver: boolean,
        base: AnyParseNode,
        attributes?: {[name: string]: string},
    |},
    "href": {|
        type: "href",
        mode: Mode,
        loc?: ?SourceLocation,
        href: string,
        body: AnyParseNode[],
        attributes?: {[name: string]: string},
    |},
    "htmlmathml": {|
        type: "htmlmathml",
        mode: Mode,
        loc?: ?SourceLocation,
        html: AnyParseNode[],
        mathml: AnyParseNode[],
        attributes?: {[name: string]: string},
    |},
    "includegraphics": {|
        type: "includegraphics",
        mode: Mode,
        loc?: ?SourceLocation,
        alt: string,
        width: Measurement,
        height: Measurement,
        totalheight: Measurement,
        src: string,
        attributes?: {[name: string]: string},
    |},
    "infix": {|
        type: "infix",
        mode: Mode,
        loc?: ?SourceLocation,
        replaceWith: string,
        size?: Measurement,
        token: ?Token,
        attributes?: {[name: string]: string},
    |},
    "kern": {|
        type: "kern",
        mode: Mode,
        loc?: ?SourceLocation,
        dimension: Measurement,
        attributes?: {[name: string]: string},
    |},
    "lap": {|
        type: "lap",
        mode: Mode,
        loc?: ?SourceLocation,
        alignment: string,
        body: AnyParseNode,
        attributes?: {[name: string]: string},
    |},
    "leftright": {|
        type: "leftright",
        mode: Mode,
        loc?: ?SourceLocation,
        body: AnyParseNode[],
        left: string,
        right: string,
        attributes?: {[name: string]: string},
    |},
    "leftright-right": {|
        type: "leftright-right",
        mode: Mode,
        loc?: ?SourceLocation,
        delim: string,
        attributes?: {[name: string]: string},
    |},
    "mathchoice": {|
        type: "mathchoice",
        mode: Mode,
        loc?: ?SourceLocation,
        display: AnyParseNode[],
        text: AnyParseNode[],
        script: AnyParseNode[],
        scriptscript: AnyParseNode[],
        attributes?: {[name: string]: string},
    |},
    "middle": {|
        type: "middle",
        mode: Mode,
        loc?: ?SourceLocation,
        delim: string,
        attributes?: {[name: string]: string},
    |},
    "mclass": {|
        type: "mclass",
        mode: Mode,
        loc?: ?SourceLocation,
        mclass: string,
        body: AnyParseNode[],
        attributes?: {[name: string]: string},
    |},
    "operatorname": {|
        type: "operatorname",
        mode: Mode,
        loc?: ?SourceLocation,
        body: AnyParseNode[],
        attributes?: {[name: string]: string},
    |},
    "overline": {|
        type: "overline",
        mode: Mode,
        loc?: ?SourceLocation,
        body: AnyParseNode,
        attributes?: {[name: string]: string},
    |},
    "phantom": {|
        type: "phantom",
        mode: Mode,
        loc?: ?SourceLocation,
        body: AnyParseNode[],
        attributes?: {[name: string]: string},
    |},
    "hphantom": {|
        type: "hphantom",
        mode: Mode,
        loc?: ?SourceLocation,
        body: AnyParseNode,
        attributes?: {[name: string]: string},
    |},
    "vphantom": {|
        type: "vphantom",
        mode: Mode,
        loc?: ?SourceLocation,
        body: AnyParseNode,
        attributes?: {[name: string]: string},
    |},
    "raisebox": {|
        type: "raisebox",
        mode: Mode,
        loc?: ?SourceLocation,
        dy: Measurement,
        body: AnyParseNode,
        attributes?: {[name: string]: string},
    |},
    "rule": {|
        type: "rule",
        mode: Mode,
        loc?: ?SourceLocation,
        shift: ?Measurement,
        width: Measurement,
        height: Measurement,
        attributes?: {[name: string]: string},
    |},
    "sizing": {|
        type: "sizing",
        mode: Mode,
        loc?: ?SourceLocation,
        size: number,
        body: AnyParseNode[],
        attributes?: {[name: string]: string},
    |},
    "smash": {|
        type: "smash",
        mode: Mode,
        loc?: ?SourceLocation,
        body: AnyParseNode,
        smashHeight: boolean,
        smashDepth: boolean,
        attributes?: {[name: string]: string},
    |},
    "sqrt": {|
        type: "sqrt",
        mode: Mode,
        loc?: ?SourceLocation,
        body: AnyParseNode,
        index: ?AnyParseNode,
        attributes?: {[name: string]: string},
    |},
    "underline": {|
        type: "underline",
        mode: Mode,
        loc?: ?SourceLocation,
        body: AnyParseNode,
        attributes?: {[name: string]: string},
    |},
    "xArrow": {|
        type: "xArrow",
        mode: Mode,
        loc?: ?SourceLocation,
        label: string,
        body: AnyParseNode,
        below: ?AnyParseNode,
        attributes?: {[name: string]: string},
    |},
};

/**
 * Asserts that the node is of the given type and returns it with stricter
 * typing. Throws if the node's type does not match.
 */
export function assertNodeType<NODETYPE: NodeType>(
    node: ?AnyParseNode,
    type: NODETYPE,
): ParseNode<NODETYPE> {
    const typedNode = checkNodeType(node, type);
    if (!typedNode) {
        throw new Error(
            `Expected node of type ${type}, but got ` +
            (node ? `node of type ${node.type}` : String(node)));
    }
    // $FlowFixMe: Unsure why.
    return typedNode;
}

/**
 * Returns the node more strictly typed iff it is of the given type. Otherwise,
 * returns null.
 */
export function checkNodeType<NODETYPE: NodeType>(
    node: ?AnyParseNode,
    type: NODETYPE,
): ?ParseNode<NODETYPE> {
    if (node && node.type === type) {
        // The definition of ParseNode<TYPE> doesn't communicate to flow that
        // `type: TYPE` (as that's not explicitly mentioned anywhere), though that
        // happens to be true for all our value types.
        // $FlowFixMe
        return node;
    }
    return null;
}

/**
 * Asserts that the node is of the given type and returns it with stricter
 * typing. Throws if the node's type does not match.
 */
export function assertAtomFamily(
    node: ?AnyParseNode,
    family: Atom,
): ParseNode<"atom"> {
    const typedNode = checkAtomFamily(node, family);
    if (!typedNode) {
        throw new Error(
            `Expected node of type "atom" and family "${family}", but got ` +
            (node ?
                (node.type === "atom" ?
                    `atom of family ${node.family}` :
                    `node of type ${node.type}`) :
                String(node)));
    }
    return typedNode;
}

/**
 * Returns the node more strictly typed iff it is of the given type. Otherwise,
 * returns null.
 */
export function checkAtomFamily(
    node: ?AnyParseNode,
    family: Atom,
): ?ParseNode<"atom"> {
    return node && node.type === "atom" && node.family === family ?
        node :
        null;
}

/**
 * Returns the node more strictly typed iff it is of the given type. Otherwise,
 * returns null.
 */
export function assertSymbolNodeType(node: ?AnyParseNode): SymbolParseNode {
    const typedNode = checkSymbolNodeType(node);
    if (!typedNode) {
        throw new Error(
            `Expected node of symbol group type, but got ` +
            (node ? `node of type ${node.type}` : String(node)));
    }
    return typedNode;
}

/**
 * Returns the node more strictly typed iff it is of the given type. Otherwise,
 * returns null.
 */
export function checkSymbolNodeType(node: ?AnyParseNode): ?SymbolParseNode {
    if (node && (node.type === "atom" || NON_ATOMS.hasOwnProperty(node.type))) {
        // $FlowFixMe
        return node;
    }
    return null;
}
