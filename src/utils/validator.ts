export function formatUrl(url: string): string {
    url = url.replace(/^\/+/, '');
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }
    return url;
}
