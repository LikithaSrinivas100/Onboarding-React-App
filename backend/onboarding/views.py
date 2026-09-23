import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Submission


@csrf_exempt
def create_submission(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST is allowed"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Request body must be valid JSON"}, status=400)

    required = ["name", "email", "track", "experience", "techStack"]
    missing = [field for field in required if not data.get(field)]
    if missing:
        return JsonResponse({"error": f"Missing fields: {', '.join(missing)}"}, status=400)

    submission = Submission.objects.create(
        name=data["name"],
        email=data["email"],
        portfolio=data.get("portfolio", ""),
        track=data["track"],
        experience=data["experience"],
        tech_stack=data["techStack"],
    )
    return JsonResponse({"id": submission.id, "message": "Submission saved"}, status=201)
