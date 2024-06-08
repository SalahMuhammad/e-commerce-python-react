from rest_framework import serializers
from .models import Repositories


class RepositoriesSerializers(serializers.ModelSerializer):


    class Meta:
        model = Repositories
        fields = '__all__'
