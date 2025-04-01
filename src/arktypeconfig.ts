import { configure } from "arktype/config";

configure({
    minLength: {
        description: node => node.rule === 1 ? "non-empty" : 'at least length {{length, number}}',
        actual: data => data.length === 0 ? "" : " (was {{actual, number}})",
        message: ctx => `must be ${ctx.expected}${ctx.actual}`
    },
    maxLength: {
        description: () => 'at most length {{length, number}}',
        actual: () => " (was {{actual, number}})",
        message: ctx => `must be ${ctx.expected}${ctx.actual}`
    },
    keywords: {
        number: {
            message: () => 'must be a number'
        }
    }
});