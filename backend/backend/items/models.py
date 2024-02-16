from django.db import models
from users.models import User


class Items(models.Model):
  name = models.CharField(max_length=150, unique=True, blank=True)
  price1 = models.FloatField(blank=True, default=0)
  price2 = models.FloatField(blank=True, default=0)
  price3 = models.FloatField(blank=True, default=0)
  price4 = models.FloatField(blank=True, default=0)
  img = models.ImageField(upload_to='items-images', blank=True, null=True)
  by = models.ForeignKey(User, on_delete=models.PROTECT)
  updated = models.DateTimeField(auto_now=True)    

  def __str__(self):
    return self.name
  

  class Meta:
    ordering = ['name', '-updated']
