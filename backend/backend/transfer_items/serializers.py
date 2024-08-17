from rest_framework import serializers
from .models import TransferItem, Transfer


class ItemTransferSerializer(serializers.ModelSerializer):
    item_nam = serializers.ReadOnlyField(source='item.name')


    class Meta:
        model = TransferItem
        # fields = '__all__'
        exclude = ['transfer']


class TransferSerializer(serializers.ModelSerializer):
    items = ItemTransferSerializer(many=True, read_only=True)
    

    def __init__(self, *args, **kwargs):
        fieldss = kwargs.pop('fieldss', None)
        super(TransferSerializer, self).__init__(*args, **kwargs)
        if fieldss:
            allowed = set(fieldss.split(','))
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)


    class Meta:
        model = Transfer
        fields = '__all__'
    