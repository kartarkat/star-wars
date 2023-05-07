export function formatHeaderString(str) {
    const words = str.split('_');
    const capitalizedWords = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    const formattedStr = capitalizedWords.join(' ');
    return formattedStr;
}

export const formatDateTime = (str) => {
    if(str){
        const date = new Date(str);
        const monthYearFormatter = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' });
        const monthYearStr = monthYearFormatter.format(date);
        const timeFormatter = new Intl.DateTimeFormat('en', { hour: 'numeric', hour12: true, minute: 'numeric' });
        const timeStr = timeFormatter.format(date);
        return `${monthYearStr} at ${timeStr}`;
    }
    return str
  };

export const formatTableData = (header, data) => {
    if(header === 'created' || header === 'edited') return formatDateTime(data)
    if(typeof data === 'object') return 'object'
    return data
  }