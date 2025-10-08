export const decodeHtml = (raw: string): string => {
    if (!raw) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = raw;
    return txt.value;
};