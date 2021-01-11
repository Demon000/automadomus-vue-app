function isNetworkError(err: Error): boolean {
    return err.message === 'Network Error';
}

export {
    isNetworkError,
};
