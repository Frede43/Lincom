from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('organizations', '0007_add_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='competition',
            name='eligibility_criteria',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='competition',
            name='prize_description',
            field=models.TextField(null=True, blank=True),
        ),
    ]
