from django.http import JsonResponse


class JSONOnlyMiddleware:
  def __init__(self, get_response):
    self.get_response = get_response

  def __call__(self, request):
    content_type = request.content_type
    method = request.method

    if method in ('OPTIONS', 'DELETE'):
      return self.get_response(request)
    
    if not content_type == 'application/json' and method not in ['GET']:
      return JsonResponse(
        {
          'detail': 'Unsupported media type. Please send data in JSON format.'
        }, 
        status=415,
        content_type='application/json'
      )

    return self.get_response(request)
