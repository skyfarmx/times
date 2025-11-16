"""
URL configuration for news_time project.
sssssss
The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import include, path,re_path

from polls.views import *


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('polls.urls',namespace="home") ),
    path('about/', about, name='about'),
    #re_path(r'^categories/',include('polls.urls',namespace="categories")), 

    re_path(r'^(?P<category_name>[\w-]+)/$', categories, name='categories'),
    re_path(r'^(?P<category_name>[\w-]+)/(?P<slug_name>[\w-]+)/$', slug, name='slug'),
    path('ckeditor/', include('ckeditor_uploader.urls')),
]


handler404 = 'polls.views.error_404_view'
