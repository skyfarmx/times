from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from ckeditor.fields import RichTextField



User = get_user_model()

class Category(models.Model):
    id = models.AutoField(auto_created=True, primary_key=True, serialize=False)
    category_name = models.CharField(max_length=250, verbose_name='Kateqoriya adı')    
    category_slug = models.SlugField(max_length=250, verbose_name='Kateqoriya yolu (url)', unique=True, blank=True)

    class Meta:
        verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):
        if not self.category_slug:
            self.category_slug = slugify(self.category_name)
        super().save(*args, **kwargs)


        
    def __str__(self):
        return self.category_name






class Article(models.Model):

    STATUS_CHOICES = (
        ("draft", "Draft"),
        ("published", "Published"),
    )

    id = models.AutoField(auto_created=True, primary_key=True, serialize=False)
    #kat_id = models.ForeignKey(Category, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=250, verbose_name='Başlıq')
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="news_articles")
    body = RichTextField()
    picture = models.ImageField(upload_to='images',blank=True,verbose_name='Şəkil')    
    publish = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="draft")

    class Meta:
        ordering = ("-publish",)

        
    def save(self, *args, **kwargs):
        if not self.slug: # Generate slug only if not already set
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)



    def __str__(self):
        return self.title
    
"""
    def get_absolute_url(self):
        from django.urls import reverse
        return reverse('slug_name', kwargs={'slug_name': self.slug}) """
    

class Comment(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=False) # For comment moderation

    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return f"Comment by {self.author} on {self.article}"



class GlobalSettings(models.Model):

    logo = models.ImageField(upload_to='images',blank=True,verbose_name='Logo') 
    site_name = models.CharField(max_length=255, default="Baku Times")
    title = models.CharField(max_length=255, default="Xəbərlər və Məqalələr Saytı")
    contact_email = models.EmailField(blank=True, null=True)
    maintenance_mode = models.CharField(max_length=50, default="light")
    phone_number = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.site_name
    

    def save(self, *args, **kwargs):
        self.pk = 1  # enforce singleton
        
        super().save(*args, **kwargs)

    @classmethod
    def get_instance(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj