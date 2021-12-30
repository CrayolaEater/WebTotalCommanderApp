export default function parseError(error) {
    switch (error) {
        case "ERROR":
            return "An error occurred.";
        case "DAEXISTS":
            return "This directory already exists!";
        case "FAEXISTS":
            return "This file already exists!";
        case "NOACCESS":
            return "Can't access this directory (check user rights)!";
        default:
            return "Something wrong happened.";
    }
}