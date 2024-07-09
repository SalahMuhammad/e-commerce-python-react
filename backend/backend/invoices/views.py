from .models import InvoiceItem, SalesInvoice, PurchaseInvoice, Invoice
from .serializers import InvoiceItemSerializer, InvoiceSerializer
from rest_framework import mixins, generics
from rest_framework.response import Response
from rest_framework import status
from django.db.utils import IntegrityError
from .utilities import get_invoice_type, update_items_prices
# with transaction.atomic():
    # transaction.atomic() is a context manager in Django that allows you to group a series of database operations into a single transaction. The main benefit of using it as a context manager is that it automatically commits the transaction if no exceptions occur. If an exception is raised during the context block, the transaction is rolled back, ensuring that the database remains in a consistent state.


class InvoiceItemsView(mixins.ListModelMixin, 
               		generics.GenericAPIView):
	serializer_class = InvoiceItemSerializer


	def get_queryset(self):
		queryset = InvoiceItem.objects.filter(invoices__id=self.kwargs['pk'])
		return queryset
        
	def get(self, request, *args, **kwargs):
		return self.list(request, *args, **kwargs)


class InvoicesView(mixins.ListModelMixin, 
               	mixins.CreateModelMixin,
               	generics.GenericAPIView):
	# queryset = Invoice.objects.all()
	queryset = Invoice.objects.select_related('repository', 'by').prefetch_related('items')
	serializer_class = InvoiceSerializer


	def get_serializer(self, *args, **kwargs):
		kwargs['invoice_type'] = get_invoice_type(self)
		return super().get_serializer(*args, **kwargs)
        
	def get(self, request, *args, **kwargs):
		return self.list(request, *args, **kwargs)

	def post(self, request, *args, **kwargs):
		try:
			# if get_invoice_type(self) == SalesInvoice:
				# item count
				# for item in request.data['invoice']['items']:
					# print(PurchaseInvoice.objects.filter(invoice__pk=item['item']))
			# return Response(status=status.HTTP_400_BAD_REQUEST)
			res = self.create(request, *args, **kwargs)
			
			items_list = request.data['items']
			update_items_prices(get_invoice_type(self), items_list, res.status_code)

			return res
		except IntegrityError as e:
			return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class InvoiceDetailView(mixins.RetrieveModelMixin, 
                	mixins.UpdateModelMixin,
                	mixins.DestroyModelMixin,
                 	generics.GenericAPIView):
	queryset = Invoice.objects.all()
	serializer_class = InvoiceSerializer


	def get_serializer(self, *args, **kwargs):
		kwargs['invoice_type'] = get_invoice_type(self)
		return super().get_serializer(*args, **kwargs)

	def get(self, request, *args, **kwargs):
		return self.retrieve(request, *args, **kwargs)

	def patch(self, request, *args, **kwargs):
		res = super().partial_update(request, *args, **kwargs)

		if 'items' in request.data:
			update_items_prices(get_invoice_type(self), request.data['items'], res.status_code)

		return res
  
	def delete(self, request, *args, **kwargs):
		invoice_instance = self.queryset.get(pk=kwargs.get('pk'))
		invoice_instance.items.all().delete()
		invoice_instance.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)
