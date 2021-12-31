from django.http.response import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import get_token
from django.http import HttpResponse

from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt
import os
import stat
import json
import datetime
import platform
import shutil

BLACKLIST = [
    "Documents and Settings",
]


def has_hidden_attribute(filepath):
    return bool(os.stat(filepath).st_file_attributes & stat.FILE_ATTRIBUTE_HIDDEN)


def octal_to_string(octal):
    result = ""
    value_letters = [(4, "r"), (2, "w"), (1, "x")]
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
        desktopPath = os.path.join(os.path.join(
            os.environ['USERPROFILE']), 'Desktop')
        downloadsPath = os.path.join(os.path.join(
            os.environ['USERPROFILE']), 'Downloads')
    else:
        desktopPath = os.path.join(os.path.join(
            os.path.expanduser('~')), 'Desktop')
        downloadsPath = os.path.join(os.path.join(
            os.path.expanduser('~')), 'Downloads')
    return HttpResponse(json.dumps([
        {"key": "home", "value": os.path.expanduser('~'), },
        {"key": "desktop", "value": desktopPath},
        {"key": "downloads", "value": downloadsPath}
    ]))


@csrf_exempt
def getFiles(request):
    reqBody = json.loads(request.body)
    path = reqBody["path"]

    files = []

    try:

        listFiles = os.listdir(path)

        for f in listFiles:
            fpath = os.path.join(path, f)
            if not has_hidden_attribute(fpath) and os.access(fpath, os.R_OK):
                stats = os.stat(fpath)
                file_name, file_extension = os.path.splitext(fpath)
                obj = {
                    "name": f,
                    "size": stats.st_size,
                    "ext": "" if os.path.isdir(fpath) else file_extension,
                    "date": datetime.datetime.fromtimestamp(stats.st_mtime).isoformat(),
                    "attr": octal_to_string(oct(stats.st_mode)[-3:]),
                    "isDir": os.path.isdir(fpath),
                    "path": fpath
                }
                files.append(obj)

        return HttpResponse(json.dumps({"code": "OK", "files": files}))
    except:
        return HttpResponse(json.dumps({"code": "NOACCESS"}))


@csrf_exempt
def mkdir(request):
    try:
        reqBody = json.loads(request.body)
        parent = reqBody["parent"]
        name = reqBody["name"]
        path = os.path.join(parent, name)
        os.mkdir(path)

        return HttpResponse(json.dumps({"code": "OK"}))
    except:
        if os.path.exists(path):
            return HttpResponse(json.dumps({"code": "DAEXISTS"}))
        return HttpResponse(json.dumps({"code": "ERROR"}))


@csrf_exempt
def mkfile(request):
    try:
        reqBody = json.loads(request.body)
        parent = reqBody["parent"]
        name = reqBody["name"]
        path = os.path.join(parent, name)
        open(path, "x")

        return HttpResponse(json.dumps({"code": "OK"}))
    except:
        if os.path.exists(path):
            return HttpResponse(json.dumps({"code": "FAEXISTS"}))
        return HttpResponse(json.dumps({"code": "ERROR"}))

@csrf_exempt
def rmFiles(request):
    reqBody = json.loads(request.body)
    paths = reqBody["paths"]
    for path in paths:
        try:
            if os.path.isdir(path["path"]):
                os.rmdir(path["path"])
            else:
                os.remove(path["path"])
        except:
            pass
    return HttpResponse(json.dumps({"code": "OK"}))

@csrf_exempt
def copyFiles(request): 
    reqBody = json.loads(request.body)
    source = reqBody["source"]
    overwrite = reqBody["overwrite"]
    files = reqBody["files"]
    overwritten = []
    toOverwrite = []
    try:
        for f in files:
            name = f["name"]
            fpath = os.path.join(source, name)
            if os.path.exists(fpath):
                if not overwrite:
                    toOverwrite.append(f["path"])
                    overwritten.append(fpath)
                else:
                    if os.path.isdir(f["path"]):
                        shutil.copytree(f["path"], source)
                    else:
                        shutil.copy2(f["path"], source)
            else:
                if os.path.isdir(f["path"]):
                    shutil.copytree(f["path"], source)
                else:
                    shutil.copy2(f["path"], source)
        return HttpResponse(json.dumps({"code" : "OK", "source" : source, "overwritten" : overwritten}))
    except:
        return HttpResponse(json.dumps({"code" : "ERROR"}))


@csrf_exempt
def cutFiles(request): 
    reqBody = json.loads(request.body)
    source = reqBody["source"]
    overwrite = reqBody["overwrite"]
    files = reqBody["files"]
    overwritten = []
    toOverwrite = []
    try:
        for f in files:
            name = f["name"]
            fpath = os.path.join(source, name)
            if os.path.exists(fpath):
                if not overwrite:
                    toOverwrite.append(f["path"])
                    overwritten.append(fpath)
                else:   
                    if os.path.isdir(fpath):
                        os.rmdir(fpath)
                    else:
                        os.remove(fpath)
                    shutil.move(f["path"], source)
            else:
                shutil.move(f["path"], source)
        return HttpResponse(json.dumps({"code" : "OK", "source" : source, "overwritten" : overwritten}))
    except:
        return HttpResponse(json.dumps({"code" : "ERROR"}))


@csrf_exempt
def getFile(request):
    reqBody = json.loads(request.body)
    file = reqBody["filePath"]
    try:
        f = open(file, "r")
        content = f.read()
        f.close()
        return HttpResponse(json.dumps({"code" : "OK","data": content}))
    except:
        return HttpResponse(json.dumps({"code" : "ERROR"}))


@csrf_exempt
def setFile(request):
    reqBody = json.loads(request.body)
    file = reqBody["filePath"]
    data = reqBody["data"]
    try:
        f = open(file, "w")
        f.write(data)
        f.close()
        return HttpResponse(json.dumps({"code" : "OK"}))
    except:
        return HttpResponse(json.dumps({"code" : "ERROR"}))


@ensure_csrf_cookie
def getToken(request):
    return JsonResponse({
        "token": get_token(request)
    })
