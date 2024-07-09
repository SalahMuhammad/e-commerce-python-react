from rest_framework import serializers
from .models import Invoice, InvoiceItem, PurchaseInvoice, Customer, Supplier, SalesInvoice
from django.db import transaction


class InvoiceItemSerializer(serializers.ModelSerializer):
    item_name = serializers.ReadOnlyField(source='item.name')


    class Meta:
        model = InvoiceItem
        fields = ['id', 'item', 'item_name', 'quantity', 'unit_price']


class InvoiceSerializer(serializers.ModelSerializer):
    # items = InvoiceItemSerializer(many=True, required=False, write_only=True)
    # by_username = serializers.SerializerMethodField(read_only=True)
    # repository_name = serializers.SerializerMethodField(read_only=True)
    # s_invoice = serializers.StringRelatedField(read_only=True)
    # p_invoice = serializers.StringRelatedField(read_only=True)
    # customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all() ,required=False, write_only=True)
    # supplier = serializers.PrimaryKeyRelatedField(queryset=Supplier.objects.all() ,required=False, write_only=True)


    class Meta: 
        model = Invoice
        fields = '__all__'


    def get_by_username(self, obj):
        return obj.by.username
    
    def get_repository_name(self, obj):
        return obj.repository.name
    
    def __init__(self, *args, **kwargs):
        self.invoice_type = kwargs.pop('invoice_type', None)
        super(InvoiceSerializer, self).__init__(*args, **kwargs)

    def create(self, validated_data):
        invoice_items_data = validated_data.pop('items', [])
        identifier = validated_data.pop('customer' if self.invoice_type == SalesInvoice else 'supplier', -1)
        invoice_type_args = get_invoice_type_args(self.invoice_type, identifier) if identifier != -1 else {}

        if not invoice_items_data:
            raise serializers.ValidationError({'detail': 'invoice_items field is required, and can not be an empty array.'})

        with transaction.atomic():
            invoice = self.Meta.model.objects.create(**validated_data)
            self.invoice_type.objects.create(**invoice_type_args, invoice=invoice)
                
            for item in invoice_items_data:
                invoice.items.create(**item)
        return invoice

    def update(self, instance, validated_data):
        with transaction.atomic():
            invoice_items_data = validated_data.pop('items', [])
            identifier = validated_data.pop('customer' if self.invoice_type == SalesInvoice else 'supplier', -1)
            invoice_type_args = get_invoice_type_args(self.invoice_type, identifier) if identifier != -1 else {}
            
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()
            
            if not identifier == -1:
                invoice_type = self.invoice_type.objects.get(invoice=instance)
                for attr, value in invoice_type_args.items():
                    setattr(invoice_type, attr, value)
                invoice_type.save()
            

            if invoice_items_data:
                instance.items.all().delete()
                for item in invoice_items_data:
                    instance.items.create(**item)
            return instance   


def get_invoice_type_args(invoice_type, identifier):
    return {'supplier': identifier} if invoice_type == PurchaseInvoice else {'customer': identifier}

