from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('organizations', '0004_merge_20250102_1446'),
    ]

    operations = [
        migrations.AddField(
            model_name='organization',
            name='stage',
            field=models.CharField(blank=True, choices=[('idea', 'Idea Stage'), ('mvp', 'MVP'), ('seed', 'Seed Stage'), ('early', 'Early Stage'), ('growth', 'Growth Stage'), ('scale', 'Scale Up')], max_length=20, null=True),
        ),
    ]
