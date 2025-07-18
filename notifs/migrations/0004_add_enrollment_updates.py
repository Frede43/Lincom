from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('notifs', '0003_add_forum_activity'),
    ]

    operations = [
        migrations.AddField(
            model_name='notificationpreference',
            name='enrollment_updates',
            field=models.BooleanField(default=True),
        ),
    ]
