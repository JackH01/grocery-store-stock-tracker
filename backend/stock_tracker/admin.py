from django.contrib import admin
from .models import ProductCategory, Product

class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)

class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "category", "stocked")

# Register your models here.
admin.site.register(ProductCategory, ProductCategoryAdmin)
admin.site.register(Product, ProductAdmin)
