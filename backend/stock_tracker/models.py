from django.db import models

# Create your models here.
class ProductCategory(models.Model):
    name = models.CharField(max_length=120, unique=True)

class Product(models.Model):
    name = models.CharField(max_length=120)
    price = models.FloatField()
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE)
    stocked = models.BooleanField(default=True)

