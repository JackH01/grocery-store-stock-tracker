from rest_framework import serializers
from .models import ProductCategory, Product

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ("id", "name")

class ProductSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ("id", "name", "price", "category", "stocked")
        lookup_field = "category"

    # Specifies the categories name instead of id.
    def get_category(self, instance):
        return instance.category.name