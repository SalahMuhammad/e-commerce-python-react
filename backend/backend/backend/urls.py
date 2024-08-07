from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static


from django.shortcuts import render

def abc(request):
  return render(request=request, template_name='index.html', context={})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/items/', include('items.urls')),
    path('api/users/', include('users.urls')),
    path('api/repositories/', include('warehouses.urls')),
    path('api/', include('client_supplier.urls')),
    path('api/invoices/', include('invoices.urls')),
    path('api-auth/', include('rest_framework.urls')),
    # re_path(r'^(?:.*)/?$', abc),
    # 
    path('api/pp/', include('pp.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
