from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from users.models import User
from items.models import Items
from warehouses.models import Repositories
from client_supplier.models import Customer, Supplier
from items.models import Stock


class InvoiceItem(models.Model):
    item = models.ForeignKey(Items, related_name='invoice_items', on_delete=models.PROTECT)
    quantity = models.PositiveSmallIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)


    def adjust_stock(self, repository, quantity):
        try:
            self.item.stock.get(repository=repository).adjust_stock(quantity=quantity)
        except Stock.DoesNotExist as e:
            self.item.stock.create(repository=repository, quantity=quantity)

    
    def __str__(self) -> str:
        return f"{self.item.name} - {self.quantity} @ {self.unit_price}"


class Invoice(models.Model):
    items = models.ManyToManyField(InvoiceItem, related_name='invoices')
    repository = models.ForeignKey(Repositories, on_delete=models.PROTECT)
    content_type = models.ForeignKey(ContentType, on_delete=models.PROTECT)
    object_id = models.PositiveIntegerField(null=True)
    content_object = GenericForeignKey("content_type", "object_id")
    by = models.ForeignKey(User, on_delete=models.PROTECT)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    
    def __str__(self) -> str:
        if hasattr(self, 's_invoice'):
            return f"Sales Invoice: {self.s_invoice.customer}"
        elif hasattr(self, 'p_invoice'):
            return f"Purchase Invoice: {self.p_invoice.supplier}"
        return "Invoice"


    class Meta:
        ordering = ['-updated']


class SalesInvoice(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, blank=True, null=True)
    invoice = models.OneToOneField(Invoice, related_name='s_invoice', on_delete=models.CASCADE)


    def __str__(self) -> str:
        return f"Sales Invoice {self.id}: {self.customer}"

    def save(self, *args, **kwargs):
        for invoice_item in self.invoice.items.all():
            invoice_item.item.adjust_stock(-invoice_item.quantity)
        super().save(*args, **kwargs)


class PurchaseInvoice(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT, blank=True, null=True)
    invoice = models.OneToOneField(Invoice, related_name='p_invoice', on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"Purchase Invoice {self.id}: {self.supplier}"
    
    def save(self, *args, **kwargs):
        for invoice_item in self.invoice.items.all():
            invoice_item.item.adjust_stock(invoice_item.quantity)
        super().save(*args, **kwargs)