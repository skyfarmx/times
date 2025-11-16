from .models import *
from django.shortcuts import render, get_object_or_404,get_list_or_404 
import datetime
from django.http import Http404


today = datetime.date.today()

class Q_db(object):

    def get_category(self,category_name=None):
        if category_name != None:
            category = get_object_or_404(Category, category_slug=category_name)
           
            return category 
        else:
            category = Category.objects.all()
            return category

    def get_article(self,category_name=None,slug_name=None ):
         
         if category_name !=None and slug_name !=None:
            get_404 = get_object_or_404(Article, category__category_slug=category_name, slug=slug_name, status='published')  
            has_content = Article.objects.filter(category__category_slug=category_name, slug=slug_name, status='published').exists() 
            if has_content:
                
                article = Article.objects.get(category__category_slug=category_name, slug=slug_name,status='published')
                return article
            else:
                # Render the 'Coming Soon' template
                context = {
                'category': get_404,
                'message': f"The '{get_404.category}' section is coming soon! Please check back later."
                }
                return context


         elif category_name!=None and slug_name ==None:
            
            get_404 = get_object_or_404(Category, category_slug=category_name)
            has_content = Article.objects.filter(category__category_slug=category_name, ).exists()
            if has_content:
                content = Article.objects.filter(category__category_slug=category_name, )
                return content
            else:
                print("not content%%%%%%%%%%%%%%%%%%")
                
                return "cooming_soon"
         else:
             return Article.objects.filter(publish__lte=today).order_by('?')
         
class Q_db_filter(object):

    def get_random(self):

        today = datetime.date.today()
        pks = Article.objects.filter(publish__lte=today).order_by('?')[:4]

        return pks

    def get_filter(self, slug, number):
        contents = Article.objects.filter(category__category_slug=slug)[:number]
        return contents