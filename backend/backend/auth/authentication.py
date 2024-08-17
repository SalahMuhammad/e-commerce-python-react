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

        try:
            user = User.objects.get(pk=payload['id'])
            # if request.method != 'DELETE':
            request.data['by'] = user.id
        except User.DoesNotExist:
            raise AuthenticationFailed('User not found.')
            # return None

        return (user, None)
