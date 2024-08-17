from django.db import models
from items.models import Items
from users.models import User
from repositories.models import Repositories
from rest_framework import serializers


class Transfer(models.Model):
	fromm = models.ForeignKey(Repositories, on_delete=models.PROTECT, related_name='fromm')
	too = models.ForeignKey(Repositories, on_delete=models.PROTECT, related_name='too')
	by = models.ForeignKey(User, on_delete=models.PROTECT)
	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)


	def clean(self):
		if self.fromm == self.too:
			raise serializers.ValidationError({'detail': "The 'from' and 'to' repositories cannot be the same."})
		
	def save(self, *args, **kwargs):
		self.full_clean()
		return super().save(*args, **kwargs)
	

	class Meta:
		ordering = ['-updated']


class TransferItem(models.Model):
	transfer = models.ForeignKey(Transfer, on_delete=models.CASCADE, related_name='items')
	item = models.ForeignKey(Items, on_delete=models.PROTECT)
	quantity = models.PositiveSmallIntegerField(default=0)

