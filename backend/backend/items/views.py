from rest_framework import generics, mixins
from .models import Items
from .serializers import ItemsSerializer
# 
from operator import and_
from functools import reduce
# 
from django.db.models import Q
# 
from rest_framework.response import Response
# 
from rest_framework import status
# 
from django.db import IntegrityError
# 
from django.db.models.deletion import ProtectedError
from django.db import transaction
# 
from .models import Images


class ItemsList(mixins.ListModelMixin, 
               mixins.CreateModelMixin,
               generics.GenericAPIView):
	queryset = Items.objects.all()
	serializer_class = ItemsSerializer

	def get_serializer(self, *args, **kwargs):
		fields = self.request.query_params.get('fields', None)
		if fields:
			kwargs['fields'] = fields.split(',')
		return super().get_serializer(*args, **kwargs)

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
		try:
			return self.create(request, *args, **kwargs)
		except IntegrityError as e:
			return Response({'name': 'هذا الصنف موجود بالفعل...'}, status=status.HTTP_400_BAD_REQUEST)

class ItemDetail(mixins.RetrieveModelMixin, 
                 mixins.UpdateModelMixin,
                 mixins.DestroyModelMixin,
                 generics.GenericAPIView):
	queryset = Items.objects.all()
	serializer_class = ItemsSerializer

	def get_serializer(self, *args, **kwargs):
		fields = self.request.query_params.get('fields', None)
		if fields:
			kwargs['fields'] = fields.split(',')
		return super().get_serializer(*args, **kwargs)

	def get(self, request, *args, **kwargs):
		return self.retrieve(request, *args, **kwargs)

	def put(self, request,*args, **kwargs):
		return super().partial_update(request, *args, **kwargs)
  
	def delete(self, request, *args, **kwargs):
		try:
			images = list(Images.objects.filter(imagess__id=kwargs['pk']))
			with transaction.atomic():
				res = super().destroy(request, *args, **kwargs)

				if res.status_code == 204:
					for image in images:
						image.img.delete()
						image.delete()

		except ProtectedError as e:
			return Response({'detail': 'لا يمكن حذف هذا العنصر قبل حذف المعاملات المرتبطه به اولا 😵...'}, status=status.HTTP_400_BAD_REQUEST)
		return Response(status=status.HTTP_204_NO_CONTENT)
  