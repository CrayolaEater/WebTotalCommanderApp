import dirIcon from '../assets/dir-icon-min.png';

export default function getIcon(file) {
    if (file.isDir) {
        return dirIcon;
    }
    return dirIcon;
}
