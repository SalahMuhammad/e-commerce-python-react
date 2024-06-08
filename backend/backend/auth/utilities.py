from django.conf import settings
import jwt, datetime


class JWTUtilities:
  @staticmethod
  def generate_jwt(user_id):
    payload = {
        'id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
        'iat': datetime.datetime.utcnow()
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