from django.db import migrations

def add_default_tenant_types(apps, schema_editor):
    TenantType = apps.get_model('chatapp', 'TenantType')
    default_types = [
        {"tenant_type_name": "Solo Professional", "description": "Individual freelancer or consultant", "minimum_people": 1, "maximum_people": 1},
        {"tenant_type_name": "Startup", "description": "Small team, early-stage company", "minimum_people": 2, "maximum_people": 10},
        {"tenant_type_name": "Growing Company", "description": "Medium-sized business", "minimum_people": 11, "maximum_people": 50},
        {"tenant_type_name": "Established Business", "description": "Large structured company", "minimum_people": 51, "maximum_people": 200},
        {"tenant_type_name": "Enterprise", "description": "Corporate/multi-branch organization", "minimum_people": 201, "maximum_people": 1000},
    ]
    for t in default_types:
        TenantType.objects.create(**t)
    print("Default TenantType entries added.")

class Migration(migrations.Migration):
    dependencies = [
        ('chatapp', '0001_initial'),  # Replace with your initial migration
    ]

    operations = [
        migrations.RunPython(add_default_tenant_types),
    ]
