from django.http.response import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import get_token
from django.http import HttpResponse

from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt
import os, stat
import json
import datetime
import platform

BLACKLIST =[
    "Documents and Settings"
]


def has_hidden_attribute(filepath):
    return bool(os.stat(filepath).st_file_attributes & stat.FILE_ATTRIBUTE_HIDDEN)


def octal_to_string(octal):
    result = ""
    value_letters = [(4,"r"),(2,"w"),(1,"x")]
    for digit in [int(n) for n in str(octal)]:
        for value, letter in value_letters:
            if digit >= value:
                result += letter
                digit -= value
            else:
                result += '-'
    return result


def getDefaultPaths(request):
    desktopPath = ""
    downloadsPath = ""
    if platform.system() == "Windows":
        desktopPath = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop')
        downloadsPath = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Downloads')
    else:
        desktopPath = os.path.join(os.path.join(os.path.expanduser('~')), 'Desktop')
        downloadsPath = os.path.join(os.path.join(os.path.expanduser('~')), 'Downloads')
    return HttpResponse(json.dumps([
        {"key": "home" , "value": os.path.expanduser('~'), },
         {"key" : "desktop", "value": desktopPath},
        {"key" : "downloads", "value" : downloadsPath }
    ]))


@csrf_exempt
def getFiles(request):

    reqBody = json.loads(request.body)
    path = reqBody["path"]

    files = []

    listFiles = os.listdir(path)

    for f in listFiles:
        fpath = os.path.join(path, f)
        if not has_hidden_attribute(fpath) and not f in BLACKLIST:
            stats = os.stat(fpath)
            file_name, file_extension = os.path.splitext(fpath)
            obj = {
                "name" : f,
                "size" : stats.st_size,
                "ext" : "" if os.path.isdir(fpath) else file_extension,
                "date" : datetime.datetime.fromtimestamp(stats.st_mtime).isoformat(),
                "attr" : octal_to_string(oct(stats.st_mode)[-3:]),
                "isDir" : os.path.isdir(fpath),
                "path" : fpath
            }
            files.append(obj)


    return HttpResponse(json.dumps(files))

@ensure_csrf_cookie
def getToken(request):
    return JsonResponse({
        "token" : get_token(request)
    })
