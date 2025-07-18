from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            """
            DROP TABLE IF EXISTS dashboard_useractivity;
            DROP TABLE IF EXISTS dashboard_dashboardpreference;
            DROP TABLE IF EXISTS dashboard_widget;
            DROP TABLE IF EXISTS dashboard_notification;
            DROP TABLE IF EXISTS dashboard_quickaction;
            """,
            reverse_sql=""
        ),
        migrations.CreateModel(
            name='DashboardPreference',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('layout', models.JSONField(default=dict)),
                ('widgets', models.JSONField(default=list)),
                ('theme', models.CharField(default='light', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='dashboard_preferences', to='users.user')),
            ],
            options={
                'ordering': ['-updated_at'],
            },
        ),
        migrations.CreateModel(
            name='Widget',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('type', models.CharField(choices=[('calendar', 'Calendrier'), ('tasks', 'Tâches'), ('stats', 'Statistiques'), ('notifications', 'Notifications'), ('activity', 'Activité'), ('quick_actions', 'Actions Rapides')], max_length=20)),
                ('description', models.TextField(blank=True)),
                ('icon', models.CharField(max_length=50)),
                ('required_permissions', models.JSONField(default=list)),
                ('settings', models.JSONField(default=dict)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['title'],
            },
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('message', models.TextField()),
                ('type', models.CharField(choices=[('info', 'Information'), ('success', 'Succès'), ('warning', 'Avertissement'), ('error', 'Erreur')], default='info', max_length=10)),
                ('action_url', models.URLField(blank=True)),
                ('is_read', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('read_at', models.DateTimeField(blank=True, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='dashboard_notifications', to='users.user')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='QuickAction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True)),
                ('action_type', models.CharField(choices=[('link', 'Lien'), ('modal', 'Modal'), ('function', 'Fonction')], max_length=10)),
                ('icon', models.CharField(max_length=50)),
                ('url', models.CharField(blank=True, max_length=200)),
                ('function_name', models.CharField(blank=True, max_length=100)),
                ('required_role', models.CharField(blank=True, max_length=50)),
                ('is_active', models.BooleanField(default=True)),
                ('order', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['order', 'title'],
            },
        ),
        migrations.CreateModel(
            name='UserActivity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('activity_type', models.CharField(choices=[('login', 'Connexion'), ('course', 'Formation'), ('mentorship', 'Mentorat'), ('project', 'Projet'), ('other', 'Autre')], max_length=20)),
                ('description', models.TextField()),
                ('metadata', models.JSONField(blank=True, default=dict)),
                ('action', models.CharField(blank=True, max_length=50, null=True)),
                ('target_object_type', models.CharField(blank=True, max_length=50, null=True)),
                ('target_object_id', models.PositiveIntegerField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='user_activities', to='users.user')),
                ('target_user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='targeted_by_activities', to='users.user')),
            ],
            options={
                'verbose_name_plural': 'User activities',
                'ordering': ['-created_at'],
            },
        ),
    ]
