import dirIcon from '../assets/dir-icon-min.png';
import fileIcon from '../assets/file-icon.png';
import exeIcon from '../assets/exe-icon.png';

export default function getIcon(file, ext = "") {
    if (file.isDir) {
        return dirIcon;
    } else if (ext === ".exe") {
        return exeIcon;
    }
    return fileIcon;
}
