import { AndOrNot } from './RqlBuilder';
import RqlNode, { RqlArg } from './RqlNode';

export type RqlVisitorInstance = { [nodeName: string | ComparitorPredicate | AndOrNot]: RqlVisitor };

type ComparitorPredicate = 'eq' | 'ne' | 'le' | 'ge' | 'lt' | 'gt';

const comparatorPredicates: Record<string, (val: number) => boolean> = {
    eq: (val) => val === 0,
    ne: (val) => val !== 0,
    le: (val) => val <= 0,
    ge: (val) => val >= 0,
    lt: (val) => val < 0,
    gt: (val) => val > 0
};

const tokenSubstitutes: Record<string, string> = {
    '\\\\': `\\\\`,
    '\\*': '\\*',
    '\\?': '\\?',
    '*': '.*',
    '?': '.'
};
export class RqlVisitor {
    sortComparator: string | string[] | null = null;
    limitValue: number = 200;
    offset: number = 0;
    propertyNameMap: Record<string, string> = {};

    constructor(options: RqlVisitorInstance) {
        Object.assign(this, options);
    }

    visit(node: RqlNode): boolean | ((item: RqlVisitorInstance) => boolean) | ((item: RqlVisitor) => boolean) {
        if (typeof this[node.name as AndOrNot] === 'function') {
            return this[node.name as AndOrNot](node.args as RqlArg[]);
        }

        if (!comparatorPredicates.hasOwnProperty(node.name)) {
            throw new Error('Unsupported node type: ' + node.name);
        }

        // default implementation for comparison operations
        const propertyName = node.args[0] as string;
        const target = node.args[1] as string;
        const comparator = this.getComparator(propertyName);
        const predicate = comparatorPredicates[node.name as ComparitorPredicate];
        return (item: RqlVisitorInstance) => predicate(comparator(this.getProperty(item, propertyName), target));
    }

    and(args: RqlArg[]) {
        const children = args.map((a) => this.visit(a));
        return (item: RqlVisitorInstance) => children.every((p) => p(item));
    }

    or(args: RqlArg[]) {
        const children = args.map((a) => this.visit(a));
        return (item: RqlVisitor) => children.some((p) => p(item));
    }

    not(args: RqlArg[]) {
        return !this.and(args);
    }

    limit(args: number[]) {
        if (args.length) {
            this.limitValue = args[0];
            this.offset = args.length > 1 ? args[1] : 0;
        }
        return (item: RqlVisitor) => true;
    }

    sort(args: any) {
        this.sortComparator = args.reduce((prev: any, arg: any) => {
            let descending = false;
            let propertyName = null;

            if (Array.isArray(arg)) {
                propertyName = arg[0];
                if (arg.length > 1) {
                    descending = !!arg[1];
                }
            } else if (arg != null) {
                // null propertyName means the object itself
                if (arg.startsWith('-')) {
                    descending = true;
                    propertyName = arg.substring(1);
                } else if (arg.startsWith('+')) {
                    propertyName = arg.substring(1);
                } else {
                    propertyName = arg;
                }
            }

            let comparator = this.getSortComparator(propertyName);
            if (descending) {
                comparator = (this.constructor as typeof RqlVisitor).reverseComparator(comparator);
            }
            return (this.constructor as typeof RqlVisitor).thenComparator(prev, comparator);
        }, null);
        return (item: RqlVisitor) => true;
    }

    in(args: ComparitorPredicate[]) {
        const propertyName = args[0];
        const searchIn = Array.isArray(args[1]) ? args[1] : args.slice(1);
        const comparator = this.getComparator(propertyName as ComparitorPredicate);
        return (item: RqlVisitor) => {
            const propertyValue = this.getProperty(item, propertyName);
            return searchIn.some((arg) => comparator(propertyValue, arg) === 0);
        };
    }

    match(args: string[]) {
        const propertyName = args[0];
        const matchString = args[1];
        const caseSensitive = !!args[2];

        const pattern = (this.constructor as typeof RqlVisitor)
            .tokenize(Object.keys(tokenSubstitutes), matchString)
            .map((t) => {
                return tokenSubstitutes.hasOwnProperty(t) ? tokenSubstitutes[t] : (this.constructor as typeof RqlVisitor).regExpEscape(t);
            })
            .join('');

        const regex = new RegExp('^' + pattern + '$', caseSensitive ? '' : 'i');
        return (item: any) => {
            const propertyValue = this.getProperty(item, propertyName);
            return regex.test(propertyValue);
        };
    }

    contains(args: string[]) {
        const propertyName = args[0];
        const target = args[1];
        const comparator = this.getComparator(propertyName);
        return (item: any) => {
            const propertyValue = this.getProperty(item, propertyName);
            if (typeof propertyValue === 'string') {
                return propertyValue.includes(target);
            } else if (Array.isArray(propertyValue)) {
                return propertyValue.some((v) => {
                    return comparator(v, target) === 0;
                });
            } else {
                throw new Error('Cant search inside ' + typeof propertyValue);
            }
        };
    }

    getProperty(item: any, propertyName: string) {
        if (this.propertyNameMap && this.propertyNameMap.hasOwnProperty(propertyName)) {
            propertyName = this.propertyNameMap[propertyName];
        }
        if (propertyName == null) {
            return item;
        }
        return propertyName.split('.').reduce((value, name) => (value != null ? value[name] : undefined), item);
    }

    getComparator(propertyName: string) {
        return (this.constructor as typeof RqlVisitor).compare;
    }

    getSortComparator(propertyName: string): (a: string, b: string) => number {
        const comparator = this.getComparator(propertyName);
        return (a, b) => {
            const valueA = this.getProperty(a, propertyName);
            const valueB = this.getProperty(b, propertyName);
            return comparator(valueA, valueB);
        };
    }

    static compare(a: string, b: string) {
        if (a === b) return 0;
        // try using valueOf()
        if (a < b) return -1;
        if (a > b) return 1;

        // items are loosely equal, use string comparison
        const strA = String(a);
        const strB = String(b);
        if (strA < strB) return -1;
        if (strA > strB) return 1;
        return 0;
    }

    static reverseComparator(comparator: (a: string, b: string) => number) {
        return (a: string, b: string) => -comparator(a, b);
    }

    static thenComparator(first: (a: string, b: string) => number, second: (a: string, b: string) => number) {
        if (first == null) {
            return second;
        }
        return (a: string, b: string) => first(a, b) || second(a, b);
    }

    static regExpEscape(s: string) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    /**
     *
     * @param {RegExp|string[]} delimiters
     * @param {string} target
     * @returns {*[]}
     */
    static tokenize(delimiters: string | string[] | RegExp, target: string) {
        if (Array.isArray(delimiters)) {
            const pattern = delimiters.map((d) => this.regExpEscape(d)).join('|');
            delimiters = new RegExp(pattern, 'g');
        }

        const tokens = [];
        let prevIndex = 0;
        let match;
        while ((match = (delimiters as RegExp).exec(target)) != null) {
            tokens.push(target.slice(prevIndex, match.index));
            tokens.push(match[0]);
            prevIndex = (delimiters as RegExp).lastIndex;
        }
        tokens.push(target.slice(prevIndex));
        return tokens.filter((t) => !!t);
    }
}
