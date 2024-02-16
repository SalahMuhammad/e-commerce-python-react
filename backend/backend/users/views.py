from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.views import APIView, status
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializers
from .models import User
import jwt, datetime
from django.conf import settings


class RegisterView(APIView):
  serializer_class = UserSerializers

  def post(self, request):
    serializer = self.serializer_class(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Response(serializer.data)
  

class LoginView(APIView):
  serializer_class = UserSerializers

  def post(self, request):
    print(request.data)
    try:
      username = request.data['username']
      print('saaa')
      password = request.data['password']
      print('sssssss')
    except Exception as e:
      print(e)
      raise AuthenticationFailed(e)
    # permissions = list(request.user.get_all_permissions())
    # a = User.objects.filter(pk=1).first()
    # print(request.u)


    # user = User.objects.get (username=username)
    user = User.objects.filter(username=username).first()

    if user is None:
      raise AuthenticationFailed('User not found!')

    if not user.check_password(password):
      raise AuthenticationFailed('Incorrect password!')
    
    payload = {
      'id': user.id,
      'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
      'iat': datetime.datetime.utcnow()
    }

    # token = jwt.encode(payload, 'secret', algorithm='HS256').decode('utf-8')
    token = jwt.encode(payload, 'secret', algorithm='HS256')

    response = Response()
    response.set_cookie(key='jwt', value=token, httponly=True, expires=payload['exp'])
    response.data = {
      'jwt': token
    }

    return response


class UserView(APIView):
  
  def get(self, request):
    token = request.COOKIES.get('jwt')

    if not token:
      raise AuthenticationFailed('Unauthenticated!')
    
    try:
      payload = jwt.decode(token, 'secret', algorithms='HS256')#['HS256'])
    except jwt.ExpiredSignatureError as e:
      raise AuthenticationFailed(e)

    # user = User.objects.filter(pk=payload['id']).first()
    user = User.objects.get(pk=payload['id'])
    serializer = UserSerializers(user)

    return Response(serializer.data)


class LogoutView(APIView):
  
  def post(self, request):
    response = Response()
    response.delete_cookie('jwt')
    response.data = {
      'message': 'success'
    }

    return response
