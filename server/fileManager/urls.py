from django.urls import path
from . import views

urlpatterns = [
    path("crsf/", views.getToken),
    path("getFiles/", views.getFiles),
    path("getDefaultPaths/", views.getDefaultPaths),
    path("mkdir/", views.mkdir),
    path("mkfile/", views.mkfile)
]
