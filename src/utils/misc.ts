import { camelKeys, snakeKeys } from 'js-convert-case/lib';

function isNetworkError(err: Error): boolean {
    return err.message === 'Network Error';
}

function objectToSnake(data: any): any {
    return snakeKeys(data, {
        recursive: true,
        recursiveInArray: true,
    });
}

function objectToCamel(data: any): any {
    return camelKeys(data, {
        recursive: true,
        recursiveInArray: true,
    });
}

export {
    isNetworkError,
    objectToSnake,
    objectToCamel,
};
