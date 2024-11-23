from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from users.models import User
from auth.utilities import JWTUtilities

class CustomAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get('auth') if request.COOKIES.get('auth') else request.headers.get('auth')
        if not token:
            return None

        payload, verification_status = JWTUtilities.verify_jwt(token)
        if not verification_status:
            raise AuthenticationFailed(payload)
        
        if request.method.lower() in ('post', 'put', 'patch'):
            request.data['by'] = payload['id']

        return (None, payload['permissions'])


        # try:
        #     user = User.objects.get(pk=payload['id'])
        #     permissions = {
        #         'is_superuser': user.is_superuser,
        #         'is_staff': user.is_staff  # Note: it's "is_staff" not "is_stuff"
        #     }
        #     # if request.method != 'DELETE':
        #     request.data['by'] = user.id
        # except User.DoesNotExist:
        #     raise AuthenticationFailed('User not found.')
        #     # return None

        # return (user, permissions)
