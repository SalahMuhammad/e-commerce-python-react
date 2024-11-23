from django.conf import settings
import jwt, datetime


class JWTUtilities:
	@staticmethod
	def generate_jwt(user):
		permissions_list = list(user.get_all_permissions())

		payload = {
			'id': user.id,
			'exp': datetime.datetime.now() + datetime.timedelta(days=1),
			'iat': datetime.datetime.now(),
			'permissions': {
                'is_superuser': user.is_superuser,
                'is_staff': user.is_staff,  # Note: it's "is_staff" not "is_stuff"
				'user_permissions': permissions_list
            }
		}
		
		return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm='HS256')

	@staticmethod
	def verify_jwt(token):      
		try:
			payload = JWTUtilities.get_jwt_payload(token)
			return payload, True
		except jwt.ExpiredSignatureError as e:
			return f'jwt.ExpiredSignatureError: {str(e)}.', False
		except jwt.InvalidSignatureError as e:
			return f'jwt.InvalidSignatureError: {str(e)}.', False
		except Exception as e:
			return e, False
  

	@staticmethod
	def get_jwt_payload(token):
		return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms='HS256')#['HS256'])


class Abc:
  username_and_password = {
    'en': 'Please provide your username and password.',
    'ar': 'يرجى ادخال اسم المستخدم وكلمه المرور.'
  }
  user_not_found = {
    'en': 'User not found!',
    'ar': 'اسم المستخدم غير موجود!'
  }
  incorrect_password = {
    'en': 'Incorrect password!',
    'ar': 'كلمه المرور غير صحيحه!'
  }