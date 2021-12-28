export default function removeLastFromUrl(url, startPos) {
    if (url === startPos) {
        return startPos;
    }
    const separator = url.indexOf("/") === -1 ? "\\" : "/";
    let the_arr = url.split(separator);
    the_arr.pop();
    return (the_arr.join(separator));
}