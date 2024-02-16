from django.shortcuts import get_object_or_404, render
from rest_framework import generics, mixins
from .models import Items
from .serializers import ItemsSerializer
# 
from .utilities import removeImgFromFileSystem
# 
from operator import and_
from functools import reduce
# 
from django.db.models import Q
# 
from rest_framework.response import Response
# 
from rest_framework.exceptions import UnsupportedMediaType
from rest_framework import status



class ItemsList(mixins.ListModelMixin, 
               mixins.CreateModelMixin,
               generics.GenericAPIView):
  queryset = Items.objects.all()
  serializer_class = ItemsSerializer

  def get(self, request, *args, **kwargs):
    return self.list(request, *args, **kwargs)

  def get_queryset(self):
    queryset = super().get_queryset()
    nameParam = self.request.query_params.get('name')

    if nameParam:
      manipulated_params = nameParam.split('&&')
      manipulated_params.pop() if manipulated_params[-1] == '' else None
      
      q_objects = [Q(name__contains=value) for value in manipulated_params]

      # Combine all Q objects using the logical AND operator '&'
      combined_q_object = reduce(and_, q_objects)

      return queryset.filter(combined_q_object)

    return queryset

  def post(self, request, *args, **kwargs):
    if 'application/json' not in request.content_type:
      message = {'detail': 'Unsupported media type: ' + request.content_type}
      return Response(message, status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE) 

    return self.create(request, *args, **kwargs)

class ItemDetail(mixins.RetrieveModelMixin, 
                 mixins.UpdateModelMixin,
                 mixins.DestroyModelMixin,
                 generics.GenericAPIView):
  queryset = Items.objects.all()
  serializer_class = ItemsSerializer

  def get(self, request, *args, **kwargs):
    return self.retrieve(request, *args, **kwargs)

  def put(self, request,*args, **kwargs):
    item = get_object_or_404(Items, pk=kwargs.get('pk'))

    response = super().update(request, *args, **kwargs)

    try:
      if request.data['img'] or request.data['img'] == '':
        removeImgFromFileSystem(response=response, instance=item)
    except KeyError as e:
      print(f'Key Error: request.data["img"], message: {e}')

    return response
  
  def delete(self, request, *args, **kwargs):
    item = get_object_or_404(Items, pk=kwargs.get('pk'))

    response = super().destroy(request, *args, **kwargs)

    removeImgFromFileSystem(response=response, instance=item)
    
    return response
  