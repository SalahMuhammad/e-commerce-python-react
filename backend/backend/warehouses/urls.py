from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RepositoriesViewset


route = DefaultRouter()
route.register(r'', RepositoriesViewset, basename='repositories')


urlpatterns = [
  path('', include(route.urls))
]
