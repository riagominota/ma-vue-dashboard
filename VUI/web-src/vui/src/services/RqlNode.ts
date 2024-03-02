/*
 * Copyright (C) 2021 Radix IoT LLC. All rights reserved.
 */

const reservedValues = new Set(['true', 'false', 'null', 'Infinity', '-Infinity']);

export type RqlArg = string | number | Date;

class RqlNode implements RqlNode {
    readonly name: string;
    readonly args: (RqlArg | RqlNode | RqlArg)[];

    constructor(name = 'and', args: (RqlArg | RqlNode | RqlArg)[] = []) {
        this.name = name;
        this.args = args;
    }

    copy = (): RqlNode => {
        const copiedArgs = this.args.map((arg) => this.constructor.bind(this).copyArg(arg));
        return new (this.constructor as typeof RqlNode)(this.name, copiedArgs);
    };

    static copyArg = (arg: RqlArg | RqlNode | RqlArg[]): RqlArg | RqlNode | RqlArg[] => {
        if (arg instanceof this) {
            return arg.copy();
        } else if (Array.isArray(arg)) {
            return arg.map((a: RqlArg) => this.copyArg(a)) as RqlArg[];
        } else if (arg instanceof Date) {
            return new Date(arg.valueOf());
        } else if (arg != null && typeof arg === 'object') {
            throw new Error('Argument cannot be an object, must be primitive, array or date');
        } else {
            return arg;
        }
    };

    /**
     * Normalizes the node. e.g. change <code>and(and(a,b),c)</code> into <code>and(a,b,c)</code>
     * Note: modifies the args, use the {@link copy} method first.
     *
     * @returns {RqlNode} the normalized node
     */
    normalize(): RqlArg | RqlNode | RqlArg[] {
        for (let i = 0; i < this.args.length; ) {
            let increment = 1;
            const arg: RqlArg | RqlNode | RqlArg[] = this.args[i];

            if (arg instanceof (this.constructor as typeof RqlNode)) {
                const child = (arg as RqlNode).normalize();
                if ((child as RqlNode).isAndOr() && (child as RqlNode).name === this.name) {
                    // change and(and(a,b),c) into and(a,b,c)
                    // change or(or(a,b),c) into or(a,b,c)
                    this.args.splice(i, 1, ...(child as RqlNode).args);
                    increment = (child as RqlNode).args.length;
                } else {
                    this.args[i] = child as RqlArg;
                }
            }

            i += increment;
        }

        if (this.isAndOr() && this.args.length === 1) {
            return this.args[0];
        }

        return this;
    }

    isAndOr() {
        return this.name === 'and' || this.name === 'or';
    }

    /**
     * Turn the node into a RQL encoded string, 'and' nodes are joined using a ampersand symbol
     * @returns {string}
     */
    toString() {
        return this.name === 'and' ? this.encodeArguments('&') : this.encode();
    }

    /**
     * Encodes the node into a string including the operator name
     * @returns {string}
     */
    encode() {
        return this.name + '(' + this.encodeArguments() + ')';
    }

    /**
     * Encodes all the arguments into a string
     * @param {string} delimiter
     * @returns {string}
     */
    encodeArguments(delimiter = ',') {
        return this.args
            .map((a) => {
                a instanceof (this.constructor as typeof RqlNode) ? a.encode() : (this.constructor as typeof RqlNode).encodeValue(a);
            })
            .join(delimiter);
    }

    /**
     * Checks if a string looks like a date (to Java)
     * @param {string} val
     * @returns {boolean}
     */
    static isDateLike(val: string) {
        return /^\d{4}-\d{2}-\d{2}/.test(val);
    }

    /**
     * Checks if a string looks like a number (to Java)
     * @param {string} val
     * @returns {boolean}
     */
    static isNumberLike(val: string) {
        // convert 1_000L to 1000
        const canonical = val
            .replace(/(\d)_(?=\d)/g, '$1') // Java numbers can have underscore separators
            .replace(/[LFD]$/i, ''); // long, float and double suffixes in Java

        // use Number constructor as it is stricter than Number.parseFloat() etc
        return !Number.isNaN(Number(canonical));
    }

    /**
     * Checks if a string is a reserved value
     * @param {string} val
     * @returns {boolean}
     */
    static isReservedValue(val: string) {
        return reservedValues.has(val);
    }

    /**
     * Encodes argument values as strings
     * @param val
     * @returns {string}
     */
    static encodeValue(val: RqlArg | RqlArg[]): RqlArg | RqlArg[] {
        if (val === undefined) {
            throw new Error('Value cannot be undefined');
        } else if (Array.isArray(val)) {
            return '(' + val.map((v) => this.encodeValue(v)) + ')';
        } else if (val instanceof Date) {
            return this.encodeString(val.toISOString());
        } else if (typeof val === 'string') {
            // prefix the value if it could potentially be construed as being a primitive reserved value,
            // number, or date
            if (this.isReservedValue(val) || this.isDateLike(val) || this.isNumberLike(val)) {
                return 'string:' + this.encodeString(val);
            } else {
                return this.encodeString(val);
            }
        } else {
            return this.encodeString(String(val));
        }
    }

    /**
     * Percent encodes strings including parenthesis
     * @param {string} s
     * @returns {string}
     */
    static encodeString(s: string) {
        return encodeURIComponent(s).replace(/[()]/g, (match) => '%' + match.charCodeAt(0).toString(16));
    }
}

export default RqlNode;
