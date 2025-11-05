from django.db import models
from django.conf import settings
from django.utils import timezone


class PasswordResetCode(models.Model):
    email = models.EmailField()
    code = models.CharField(max_length=12)
    created_at = models.DateTimeField(default=timezone.now)
    used_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField()

    class Meta:
        indexes = [
            models.Index(fields=["email", "code"]),
            models.Index(fields=["expires_at"]),
        ]

    def mark_used(self):
        self.used_at = timezone.now()
        self.save(update_fields=["used_at"])
