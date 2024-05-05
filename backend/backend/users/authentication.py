from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import User
from .utilities import JWTUtilities

class CustomAuthentication(BaseAuthentication):
    def authenticate(self, request):
        # Implement your custom authentication logic here
        # Example: Check if a custom header is present in the request
        # 
        # auth_header = request.headers.get('X-Custom-Auth')
        # print(request.headers)
        # if not auth_header:
        #     return None
        
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        
        payload, verification_status = JWTUtilities.verify_jwt(token)

        if not verification_status:
            raise AuthenticationFailed(payload)
        
        user = User.objects.filter(pk=payload['id']).first()
        if not user:
            raise AuthenticationFailed('User not found!')
        
        return (user, None)
