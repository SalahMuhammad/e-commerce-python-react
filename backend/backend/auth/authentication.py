from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from users.models import User
from auth.utilities import JWTUtilities

class CustomAuthentication(BaseAuthentication):
    
    def authenticate(self, request):
        # token = request.COOKIES.get('jwt') if request.COOKIES.get('jwt') else request.headers.get('Authorization')
        # if not token:
        #     return None
# fall back
        # payload, verification_status = JWTUtilities.verify_jwt(token)
        # if not verification_status:
        #     raise AuthenticationFailed(payload)

        try:
            # user = User.objects.get(pk=payload['id'])
            user = User.objects.get(pk=1)
        except User.DoesNotExist:
            # raise AuthenticationFailed('User not found.')
            return None
        
        if request.method in ['POST', 'PUT', 'PATCH']:
            # request.data._mutable = True
            request.data['by'] = user.id
            # request.data._mutable = False
            return (user, None)

        return (user, None)
