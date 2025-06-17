import { configure } from "arktype/config";

configure({
    keywords: {
        string: {
            message: () => 'is required'
        },
        number: {
            message: () => 'must be a number'
        }
    }
});