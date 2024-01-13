/*
 * Copyright (C) 2021 Radix IoT LLC. All rights reserved.
 */

import { RqlVisitor } from './RqlVisitor';
import RqlNode from './RqlNode';

export class RqlFilter {
    /**
     * @param {RqlNode} node
     * @param {RqlVisitor} visitor
     */
    constructor(node: RqlNode, visitor = new RqlVisitor()) {
        this.test = visitor.visit(node);
        this.limit = visitor.limitValue;
        this.offset = visitor.offset;
        this.sort = visitor.sortComparator;
    }

    /**
     * Applies the filtering, sorting, limit and offset
     *
     * @param {*[]} array
     * @returns {*[]}
     */
    apply(array) {
        let result = array.filter(this.test);
        const total = result.length;
        if (this.sort) {
            result.sort(this.sort);
        }
        if (this.limit != null) {
            result = result.slice(this.offset, this.offset + this.limit);
        }
        result.$total = total;
        return result;
    }
}

export default RqlFilter;
