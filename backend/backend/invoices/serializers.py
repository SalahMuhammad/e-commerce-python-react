from rest_framework import serializers
from .models import Invoice, InvoiceItem, Customer, Supplier
from django.db import transaction
from client_supplier.serializers import SupplierSerializers, CustomerSerializers
from client_supplier.models import Customer, Supplier
from .utilities import compare_items


class InvoiceItemSerializer(serializers.ModelSerializer):
    # item_name = serializers.ReadOnlyField(source='item.name')


    class Meta:
        model = InvoiceItem
        # fields = ['id', 'item', 'item_name', 'quantity', 'unit_price']
        fields = ['id', 'item', 'quantity', 'unit_price']


# class TaggedObjectRelatedField(serializers.RelatedField):
#     def to_representation(self, value):
#         if isinstance(value, Supplier):
#             serializer = SupplierSerializers(value)
#         elif isinstance(value, CustomerSerializers):
#             serializer = CustomerSerializers(value)
#         else:
#             raise Exception('Unexpected type of tagged object')

#         return serializer.data


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, required=False)
    by_username = serializers.SerializerMethodField(read_only=True)
    repository_name = serializers.SerializerMethodField(read_only=True)
    

    class Meta: 
        model = Invoice
        fields = '__all__'
        abstract = True
        extra_kwargs = {
            'by': {'write_only': True},
            'repository': {'write_only': True},
            'object_id': {'write_only': True},
            'content_type': {'write_only': True}
        }


    def get_by_username(self, obj):
        return obj.by.username
    
    def get_repository_name(self, obj):
        return obj.repository.name


class SalesInvoiceSerializer(InvoiceSerializer):
    customer = serializers.SerializerMethodField(read_only=True)
    

    def get_customer(self, obj):
        s = Customer.objects.filter(pk=obj.object_id)
        return str(s[0].name if s else None)

    def create(self, validated_data):
        is_invoice_type_supported(validated_data, 11)
        invoice_items_data = validated_data.pop('items', [])

        is_invoice_has_items_or_rise_an_error(invoice_items_data)

        with transaction.atomic():
            invoice = super().create(validated_data)
            insert_invoice_items(invoice, invoice_items_data, validated_data['repository'], -1)
                
        return invoice

    def update(self, instance, validated_data):
        is_invoice_type_supported(validated_data, 11)
        with transaction.atomic():
            invoice_items_data = validated_data.pop('items', [])
            validated_data.pop('content_type', None)
            repository = validated_data.get('repository', instance.repository)

            if repository != instance.repository and invoice_items_data == []:
                raise serializers.ValidationError({'detail': f'repository can\'t be updated without updating items too...'})

            if invoice_items_data:
                handle_items(instance, invoice_items_data, repository, -1)

            super().update(instance, validated_data)
            
            return instance 


class PurchaseInvoiceSerializer(InvoiceSerializer):
    supplier = serializers.SerializerMethodField(read_only=True)


    def get_supplier(self, obj):
        s = Supplier.objects.filter(pk=obj.object_id)
        return str(s[0].name if s else None)

    def create(self, validated_data):
        is_invoice_type_supported(validated_data, 12)
        invoice_items_data = validated_data.pop('items', [])

        is_invoice_has_items_or_rise_an_error(invoice_items_data)

        with transaction.atomic():
            invoice = super().create(validated_data)
            insert_invoice_items(invoice, invoice_items_data, validated_data['repository'], 1)
                
        return invoice

    def update(self, instance, validated_data):
        is_invoice_type_supported(validated_data, 12)
        with transaction.atomic():
            invoice_items_data = validated_data.pop('items', [])
            validated_data.pop('content_type', None)
            repository = validated_data.get('repository', instance.repository)

            if repository != instance.repository and invoice_items_data == []:
                raise serializers.ValidationError({'detail': f'repository can\'t be updated without updating items too...'})

            if invoice_items_data:
                handle_items(instance, invoice_items_data, repository, 1)

            super().update(instance, validated_data)

            return instance 


def insert_invoice_items(invoice_instance, invoice_items_list, repository, sign):
    for item in invoice_items_list:
        new_item = invoice_instance.items.create(**item)
        new_item.adjust_stock(repository, item.get('quantity', 1) * sign)

def is_invoice_type_supported(validated_data, contetn_type_id):
    if 'content_type' in validated_data and validated_data['content_type'].id != contetn_type_id:
        raise serializers.ValidationError({'detail': 'unsupported invoice type 😵...'})
    
def is_invoice_has_items_or_rise_an_error(invoice_items_list):
    """
        when users attempt to insert new invoice, invoice must contains its related items
    """
    if not invoice_items_list:
        raise serializers.ValidationError({'detail': 'invoice_items field is required, and can not be an empty array.'})

def handle_items(instance, invoice_items_data, repository, sign):
    items_to_remove, items_to_add = compare_items(instance.items.all(), invoice_items_data)

    # items to remove
    if items_to_remove:
        items = instance.items.filter(item_id__in=items_to_remove)
        for item in items:
            item.adjust_stock(instance.repository, (-item.quantity) * sign)
            item.delete()
    
    # items to add
    for item_id in items_to_add:
        n = 0
        while True:
            if invoice_items_data[n]['item'].id == item_id:
                break
            n+=1
        item = invoice_items_data.pop(n)
        _item = instance.items.create(**item)
        _item.adjust_stock(repository, (item.get('quantity', 1)) * sign)
    
    # items to update
    for item in invoice_items_data:
        _item = instance.items.get(item=item['item'])
        if instance.repository != repository:
            _item.adjust_stock(instance.repository, (-_item.quantity) * sign)
            _item.adjust_stock(repository, (item.get('quantity', 1)) * sign)
        else:
            _item.adjust_stock(repository, (item.get('quantity', 1) - _item.quantity) * sign)
        _item.quantity = item.get('quantity', 1)
        _item.unit_price = item.get('unit_price', _item.unit_price)
        _item.save()