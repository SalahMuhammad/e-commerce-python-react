from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from users.models import User
from auth.utilities import JWTUtilities

class CustomAuthentication(BaseAuthentication):
    
    def authenticate(self, request):
        token = request.COOKIES.get('jwt') if request.COOKIES.get('jwt') else request.headers.get('Authorization')
        if not token:
            return None

        payload, verification_status = JWTUtilities.verify_jwt(token)
        if not verification_status:
            raise AuthenticationFailed(payload)

        try:
            user = User.objects.get(pk=payload['id'])
        except User.DoesNotExist:
            raise AuthenticationFailed('User not found.')
        
        request.data['by'] = user.id

        return (user, None)
