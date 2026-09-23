from django.db import models


class Submission(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    portfolio = models.URLField(blank=True)
    track = models.CharField(max_length=50)
    experience = models.CharField(max_length=30)
    tech_stack = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.track}"
