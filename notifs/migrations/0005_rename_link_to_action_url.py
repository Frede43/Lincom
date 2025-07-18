from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('notifs', '0004_add_enrollment_updates'),
    ]

    operations = [
        migrations.RenameField(
            model_name='notification',
            old_name='link',
            new_name='action_url',
        ),
    ]
