export enum APIErrorCode {
    AREA_ADD_FAILED = 'area-add-failed',
    AREA_UPDATE_FAILED = 'area-update-failed',
    AREA_UPDATED_AT_TIMESTAMP_INVALID = 'area-updated-at-timestamp-invalid',
    AREA_OWNER_INVALID = 'area-owner-invalid',
    AREA_NAME_INVALID = 'area-name-invalid',
    AREA_CATEGORY_INVALID = 'area-category-invalid',
    AREA_LOCATION_INVALID = 'area-location-invalid',
    AREA_LOCATION_POINT_INVALID = 'area-location-point-invalid',
    AREA_IMAGE_INVALID = 'area-image-invalid',
}

export enum APIErrorType {
    API_ERROR = 'api-error',
    VALIDATION_ERROR = 'validation-error',
    MULTI_ERROR = 'multi-error',
}

export interface APIError {
    code: APIErrorCode;
    message: string;
    originalMessage: string;
    error: true;
    type: APIErrorType;
}

export interface ValidationError extends APIError {
    fieldName: string;
    validValues: any[];
}

export interface MultiError extends APIError {
    errors: APIError[];
}

export function apiErrorToHTMLString(error: APIError): string {
    let htmlString = '';

    htmlString += `Error code: ${error.code}`;
    htmlString += '<br>';

    htmlString += `Error message: ${error.message}`;
    htmlString += '<br>';

    return htmlString;
}

export function validationErrorToHTMLString(error: ValidationError): string {
    let htmlString = apiErrorToHTMLString(error);

    htmlString += `Field name: ${error.fieldName}`;
    htmlString += '<br>';

    if (error.validValues) {
        htmlString += 'Valid values:';
        htmlString += '<br>';
        for (const validValue of error.validValues) {
            htmlString += `&#9;${validValue}`;
            htmlString += '<br>';
        }
    }

    return htmlString;
}

export function multiErrorToHTMLString(multiError: MultiError): string {
    let htmlString = apiErrorToHTMLString(multiError);

    if (!multiError.errors) {
        return htmlString;
    }

    htmlString += '<br>';

    for (const error of multiError.errors) {
        if (error.type === APIErrorType.VALIDATION_ERROR) {
            htmlString += validationErrorToHTMLString(error as ValidationError);
        }

        htmlString += '<br>';
    }

    return htmlString;
}

export function errorToHTMLString(error: APIError): string {
    if (error.type === APIErrorType.API_ERROR) {
        return apiErrorToHTMLString(error);
    } else if (error.type === APIErrorType.VALIDATION_ERROR) {
        return validationErrorToHTMLString(error as ValidationError);
    } else if (error.type === APIErrorType.MULTI_ERROR) {
        return multiErrorToHTMLString(error as MultiError);
    }

    return '';
}
