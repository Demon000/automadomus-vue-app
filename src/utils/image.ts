export function base64ImageToUrl(image: string | undefined): string {
    if (!image) {
        return '';
    }

    return `url(data:image/png;base64,${image})`;
}
