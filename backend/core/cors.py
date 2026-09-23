from django.http import JsonResponse


class SimpleCorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method == "OPTIONS":
            response = JsonResponse({}, status=204)
        else:
            response = self.get_response(request)

        response["Access-Control-Allow-Origin"] = "http://localhost:5173"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        return response
