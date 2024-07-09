from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Customer, Supplier
from .serializers import CustomerSerializers, SupplierSerializers


class CustomersViewset(ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializers


class SuppliersViewset(ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializers
