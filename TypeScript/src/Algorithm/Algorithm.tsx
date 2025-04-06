export const formatDate = (dateString: string ) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).replace(',', '');
};

export const formatDate2 = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).replace(',', '');
};
