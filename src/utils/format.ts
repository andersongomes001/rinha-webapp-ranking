export function formatMsToScientific(msString: string, precision = 2): string {
    const num = parseFloat(msString);
    if (isNaN(num)) return msString;
    return `${num.toExponential(precision)}`;
}
