from rest_framework import viewsets
from .models import Repositories
from .serializers import RepositoriesSerializers


class RepositoriesViewset(viewsets.ModelViewSet):
    queryset = Repositories.objects.all()
    serializer_class = RepositoriesSerializers
