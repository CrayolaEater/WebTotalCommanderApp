from django.urls import path
from . import views

urlpatterns = [
    path("post/", views.post),
    path("crsf/", views.getToken),
    path("getFiles/", views.getFiles)
]