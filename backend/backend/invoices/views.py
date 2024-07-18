from .models import InvoiceItem, Invoice
from .serializers import InvoiceItemSerializer, SalesInvoiceSerializer, PurchaseInvoiceSerializer
from rest_framework import mixins, generics
from rest_framework.response import Response
from rest_framework import status
from django.db.utils import IntegrityError
from .utilities import get_invoice_type, update_items_prices
from django.db import transaction
from django.forms import ValidationError

# with transaction.atomic():
    # transaction.atomic() is a context manager in Django that allows you to group a series of database operations into a single transaction. The main benefit of using it as a context manager is that it automatically commits the transaction if no exceptions occur. If an exception is raised during the context block, the transaction is rolled back, ensuring that the database remains in a consistent state.


# items = MaterialRequest.objects.all().order_by('-id').prefetch_related('allotment_set')
def get_transaction_no(self, obj):
        if obj.supmodel_set.all():
            return obj.allotment_set.all()[0].transaction_no
        return None

class InvoiceItemsView(mixins.ListModelMixin, 
               		generics.GenericAPIView):
	serializer_class = InvoiceItemSerializer


	def get_queryset(self):
		queryset = InvoiceItem.objects.filter(invoices__id=self.kwargs['pk'])
		return queryset
        
	def get(self, request, *args, **kwargs):
		return self.list(request, *args, **kwargs)


class AbstractView(mixins.ListModelMixin,
				   mixins.CreateModelMixin,
				   generics.GenericAPIView):
	def get(self, request, *args, **kwargs):
		return self.list(request, *args, **kwargs)

	def post(self, request, *args, **kwargs):
		try:
			return self.create(request, *args, **kwargs)
		except IntegrityError as e:
			return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AbstractDetailView(mixins.RetrieveModelMixin,
						 mixins.UpdateModelMixin,
						 mixins.DestroyModelMixin,
						 generics.GenericAPIView):
	def get(self, request, *args, **kwargs):
		return self.retrieve(request, *args, **kwargs)

	def patch(self, request, *args, **kwargs):
		return super().partial_update(request, *args, **kwargs)
  
	def delete(self, request, *args, **kwargs):
		invoice_instance = self.queryset.get(pk=kwargs.get('pk'))
		sign = -1 if self.request.build_absolute_uri().__contains__('purchase') else 1

		with transaction.atomic():
			for item in invoice_instance.items.all():
				item.adjust_stock(invoice_instance.repository, item.quantity * sign)
				item.delete()

			invoice_instance.delete()
			
		return Response(status=status.HTTP_204_NO_CONTENT)


class SalesInvoicesView(AbstractView):
	queryset = Invoice.objects.filter(content_type=11)
	serializer_class = SalesInvoiceSerializer


class SalesInvoiceDetailView(AbstractDetailView):
	queryset = Invoice.objects.filter(content_type=11)
	serializer_class = SalesInvoiceSerializer


class PurchaseInvoicesView(AbstractView):
	queryset = Invoice.objects.filter(content_type=12)
	serializer_class = PurchaseInvoiceSerializer


	def post(self, request, *args, **kwargs):
		res = super().post(request, *args, **kwargs)
		update_items_prices(request.data['items'], res.status_code)
		return res


class PurchaseInvoiceDetailView(AbstractDetailView):
	queryset = Invoice.objects.filter(content_type=12)
	serializer_class = PurchaseInvoiceSerializer

	def patch(self, request, *args, **kwargs):
		res = super().partial_update(request, *args, **kwargs)

		if 'items' in request.data:
			update_items_prices(request.data['items'], res.status_code)

		return res
