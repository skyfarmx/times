from django.shortcuts import render, get_object_or_404
from polls.get_query import Q_db , Q_db_filter

query = Q_db()
query_with_filter =Q_db_filter()



def home(request):
     categories = query.get_category()
     latest_content =query.get_article()                                                                 
     contents = query_with_filter.get_filter(slug="meneviyyat",number=3)     
     
     return render(request, 'index.html',{'categories':categories, 'latest_content':latest_content.first(), 'latest_content7':latest_content, 'contents':contents})


def categories(request,category_name):
     categories = query.get_category()
     if_not_page = query.get_category(category_name)
     contents =   query.get_article(category_name=category_name,slug_name=None)
     if contents == "cooming_soon":
          return render(request, "comingsoon.html",{'categories':categories},)

     return render(request, 'category.html',{'categories':categories,'if_not_page':if_not_page, 'contents': contents})
    

def slug(request,category_name,slug_name):
     article = query.get_article(category_name=category_name,slug_name=slug_name)             
     categories = query.get_category()     
     random_sevenday= query_with_filter.get_random()
    
     return render(request, 'post.html', {'categories':categories, 'article':article, 'random_sevenday':random_sevenday })


def about(request):
     article =  query.get_category()
     return render(request, 'about.html', {'categories':article,})




def error_404_view(request, exception):
    return render(request, '404.html', status=404)


def coming_soon(requset):
     return render(requset, "comingsoon.html")