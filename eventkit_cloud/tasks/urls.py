# -*- coding: utf-8 -*-


from django.conf.urls import url

from eventkit_cloud.tasks.views import download

urlpatterns = []


urlpatterns += [
    url(r'^download', download)
]

