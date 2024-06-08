from django.db import models
from users.models import User
from items.models import Items


class Invoice(models.Model):
    # type = models.
    by = models.ForeignKey(User, on_delete=models.PROTECT)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return super().__str__()
    

    class Meta:
        ordering = ['-updated']


class InvoiceItem(models.Model):
    item = models.ForeignKey(Items, on_delete=models.PROTECT)
