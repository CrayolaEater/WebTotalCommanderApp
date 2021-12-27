export default function removeLastFromUrl(url) {
    let the_arr = url.split('/');
    the_arr.pop();
    if (the_arr.join('/') === "") {
        return "/";
    }
    return (the_arr.join('/'));
}