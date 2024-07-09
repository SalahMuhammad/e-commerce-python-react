from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomersViewset, SuppliersViewset


route1 = DefaultRouter()
route1.register(r'', CustomersViewset, basename='customers')
route2 = DefaultRouter()
route2.register(r'', SuppliersViewset, basename='suppliers')


urlpatterns = [
    path('customers/', include(route1.urls)),
    path('suppliers/', include(route2.urls)),
]