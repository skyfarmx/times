

from django.urls import path, re_path
from . import views
app_name = 'polls'

urlpatterns = [
    path('', views.home, name='home'), 
    #re_path(r'^(?P<page_slug>[\w-]+)/$', views.categories, name='categories'),
    #re_path(r'^(?P<page_slug>[\w-]+)/(?P<id>[0-9]+)/$', views.slug, name='slug'),

]