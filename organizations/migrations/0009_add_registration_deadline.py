from django.db import migrations, models
import django.utils.timezone

class Migration(migrations.Migration):
    dependencies = [
        ('organizations', '0008_add_missing_competition_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='competition',
            name='registration_deadline',
            field=models.DateTimeField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
