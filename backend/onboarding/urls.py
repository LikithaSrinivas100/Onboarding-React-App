from django.urls import path

from .views import create_submission


urlpatterns = [
    path("onboarding/", create_submission, name="create-submission"),
]
