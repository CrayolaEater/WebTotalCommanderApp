from django.http.response import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import get_token
from django.http import HttpResponse

from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt
import os, stat
import json


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

@csrf_exempt
def post(request):
    return HttpResponse(request.body)


@csrf_exempt
def getFiles(request):

    reqBody = json.loads(request.body)
    path = reqBody["path"]

    files = []

    listFiles = os.listdir(path)

    for f in listFiles:
        fpath = os.path.join(path, f)
        if not has_hidden_attribute(fpath):
            stats = os.stat(fpath)
            file_name, file_extension = os.path.splitext(fpath)
            obj = {
                "name" : f,
                "size" : stats.st_size,
                "ext" : "" if os.path.isdir(fpath) else file_extension,
                "date" : stats.st_mtime,
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
