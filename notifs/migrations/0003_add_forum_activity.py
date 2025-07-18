from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('notifs', '0002_add_notification_preferences'),
    ]

    operations = [
        migrations.AddField(
            model_name='notificationpreference',
            name='forum_activity',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='notification',
            name='link',
            field=models.URLField(blank=True, name='action_url'),
        ),
    ]
