import dateFormat from "dateformat";

export function dateToDBTime(dateTime) {
    return dateFormat(dateTime, "isoDateTime").substring(0, 19);
}
