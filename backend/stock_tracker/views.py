from django.shortcuts import render
from rest_framework import viewsets
from .serializers import ProductCategorySerializer, ProductSerializer
from .models import ProductCategory, Product

# Create your views here.
class ProductCategoryView(viewsets.ModelViewSet):
    serializer_class = ProductCategorySerializer
    queryset = ProductCategory.objects.all()

class ProductView(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()

