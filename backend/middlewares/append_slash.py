from django.http import HttpResponsePermanentRedirect
from django.utils.deprecation import MiddlewareMixin

class AppendSlashMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if not request.path.endswith('/'):
            print(request)
            return HttpResponsePermanentRedirect(f"{request.path}/")
