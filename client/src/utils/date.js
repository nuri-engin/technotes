
export const setDateTimeFormat = (date) => {
    let dateObject = new Date(date);

    return `${setDateFormat(date)} ${dateObject.toLocaleTimeString()}`;
};

export const setDateFormat = (date) => {
    let dateObject = new Date(date),
        formattedDate;
    var dd = String(dateObject.getDate()).padStart(2, "0");
    var mm = String(dateObject.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = dateObject.getFullYear();

    formattedDate = `${dd}/${mm}/${yyyy}`;

    return formattedDate;
};

export const setTimeFormat = (date) => {
    let dateObject = new Date(date);
    return dateObject.toLocaleTimeString();
};