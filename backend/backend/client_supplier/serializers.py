from rest_framework import serializers
from .models import Customer, Supplier


class CustomerSerializers(serializers.ModelSerializer):
    by_username = serializers.SerializerMethodField()


    class Meta:
        model = Customer
        fields = '__all__'

    
    def get_by_username(self, obj):
        return obj.by.username


class SupplierSerializers(serializers.ModelSerializer):
    by_username = serializers.SerializerMethodField()


    class Meta:
        model = Supplier
        fields = '__all__'


    def get_by_username(self, obj):
        return obj.by.username