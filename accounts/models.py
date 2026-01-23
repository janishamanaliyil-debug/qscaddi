from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    """
    Custom user model for QS management app
    """
    USER_ROLE_CHOICES = [
        ('app_team', 'App Team'),
        ('tenant_admin', 'Tenant Admin'),
        ('tenant_employee', 'Tenant Employee'),
    ]

    role = models.CharField(max_length=20, choices=USER_ROLE_CHOICES, default='tenant_employee')

    def __str__(self):
        return f"{self.username} ({self.role})"
