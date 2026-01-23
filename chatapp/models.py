from django.db import models

# Create your models here.
from django.db import models

class TenantType(models.Model):
    # Primary key, auto-created by Django if you don't specify, but explicitly adding for clarity
    id = models.AutoField(primary_key=True)

    # Tenant category name
    tenant_type_name = models.CharField(max_length=100, unique=True)

    # Optional description
    description = models.TextField(blank=True, null=True)

    # Minimum number of people for this type
    minimum_people = models.PositiveIntegerField()

    # Maximum number of people for this type
    maximum_people = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.tenant_type_name} ({self.minimum_people}-{self.maximum_people} people)"
