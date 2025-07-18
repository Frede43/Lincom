from django.db import migrations, models
import django.utils.timezone

class Migration(migrations.Migration):
    dependencies = [
        ('organizations', '0006_add_organization_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='competition',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='competition',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
