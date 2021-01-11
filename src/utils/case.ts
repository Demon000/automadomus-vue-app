import { camelKeys, snakeKeys } from 'js-convert-case/lib';

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
    objectToSnake,
    objectToCamel,
};
