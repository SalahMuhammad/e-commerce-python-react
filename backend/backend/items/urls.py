from django.urls import path
from .views import ItemsList, ItemDetail


urlpatterns = [
  path('', ItemsList.as_view(), name='items-list'),
  path('<int:pk>/', ItemDetail.as_view(), name='item-detail'),
]
