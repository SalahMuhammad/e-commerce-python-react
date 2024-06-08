from django.db import models
from users.models import User


class Items(models.Model):
	name = models.CharField(max_length=150, unique=True)
	price1 = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	price2 = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	price3 = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	price4 = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	by = models.ForeignKey(User, on_delete=models.PROTECT)
	updated = models.DateTimeField(auto_now=True)
	created = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.name


	class Meta:
		ordering = ['name', '-updated']


class Images(models.Model):
	img = models.ImageField(upload_to='items-images', null=True)
	item = models.ForeignKey(Items, related_name='images', null=True, on_delete=models.PROTECT)

	def __str__(self):
		return self.image.url
