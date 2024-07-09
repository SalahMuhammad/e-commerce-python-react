from django.urls import path, include
from .views import InvoicesView, InvoiceDetailView, InvoiceItemsView


urlpatterns = [
    path('purchase/', InvoicesView.as_view()),
    path('purchase/<int:pk>/', InvoiceDetailView.as_view()),
    path('sales/', InvoicesView.as_view()),
    path('sales/<int:pk>/', InvoiceDetailView.as_view()),
    path('items/<int:pk>/', InvoiceItemsView.as_view()),
]