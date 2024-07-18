from django.urls import path, include
from .views import InvoiceItemsView, SalesInvoicesView, PurchaseInvoicesView, SalesInvoiceDetailView, PurchaseInvoiceDetailView


urlpatterns = [
    path('purchase/', PurchaseInvoicesView.as_view()),
    path('purchase/<int:pk>/', PurchaseInvoiceDetailView.as_view()),
    path('sales/', SalesInvoicesView.as_view()),
    path('sales/<int:pk>/', SalesInvoiceDetailView.as_view()),
    path('items/<int:pk>/', InvoiceItemsView.as_view()),
]