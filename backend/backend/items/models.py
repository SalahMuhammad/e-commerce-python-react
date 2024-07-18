from django.db import models
from django.forms import ValidationError
from users.models import User
from django.conf import settings
from warehouses.models import Repositories
from rest_framework import serializers


class Items(models.Model):
	name = models.CharField(max_length=150, unique=True)
	price1 = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	price2 = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	price3 = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	price4 = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	images = models.ManyToManyField('Images', related_name='imagess', blank=True)
	by = models.ForeignKey(User, on_delete=models.PROTECT)
	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)

	# run on fly whenever accessed
	# @property
	# def stock(self):
	# 	purchased_quantity = PurchaseInvoice.objects.filter(invoice__items__item=self).aggregate(Sum('invoice__items__quantity'))['invoice__items__quantity__sum'] or 0
	# 	sold_quantity = SalesInvoice.objects.filter(invoice__items__item=self).aggregate(Sum('invoice__items__quantity'))['invoice__items__quantity__sum'] or 0
	# 	return purchased_quantity - sold_quantity

	def __str__(self):
		return self.name


	class Meta:
		ordering = ['name', '-updated']


class Images(models.Model):
	img = models.ImageField(upload_to='items-images', null=True)

	def __str__(self):
		return f'{settings.MEDIA_URL}{self.img}'
	

class Stock(models.Model):
	quantity = models.PositiveSmallIntegerField(default=0)
	item = models.ForeignKey(Items, related_name='stock', on_delete=models.PROTECT)
	repository = models.ForeignKey(Repositories, on_delete=models.PROTECT)


	def adjust_stock(self, quantity):
		new_stock = self.quantity + quantity
		if new_stock < 0:
			raise serializers.ValidationError({'detail': f'لا توجد قطع كافيه من {self.item} 😵...'})
		self.quantity = new_stock
		self.save()
	
	def __str__(self) -> str:
		return super().__str__()
	

	class Meta:
		ordering = ['repository']


