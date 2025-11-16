from django.contrib import admin
from .models import Category, Article, Comment
from django import forms
from ckeditor.widgets import CKEditorWidget



class CategoryAdmin(admin.ModelAdmin):
    # Automatically generate the slug from the name field
    #prepopulated_fields = {'slug': ('name',)}
    #list_display = ('name', 'slug')
    list_display = ['category_name','category_slug']
    search_fields = ['category_name', ]
    class Meta:
        model = Article
        fields = '__all__'

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    #body = forms.CharField(widget=CKEditorWidget())
    prepopulated_fields = {'slug': ('title',)}
    list_display = ('title', 'author', 'category', 'status', 'publish')
    list_filter = ('status', 'publish', 'author', 'category')
    search_fields = ('title', 'body')
    date_hierarchy = 'publish'
    raw_id_fields = ('author',) # For easily selecting authors if there are many

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('article', 'author', 'created_at', 'active')
    list_filter = ('active', 'created_at')
    search_fields = ('article__title', 'author__username', 'content')
    actions = ['approve_comments'] # Add a custom admin action

    def approve_comments(self, request, queryset):
        queryset.update(active=True)
    approve_comments.short_description = "Mark selected comments as approved"

admin.site.register(Category,CategoryAdmin)
