from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='SearchFilter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(choices=[('course', 'Course'), ('startup', 'Startup'), ('project', 'Project'), ('competition', 'Competition'), ('resource', 'Resource'), ('user', 'User'), ('organization', 'Organization')], max_length=20)),
                ('name', models.CharField(max_length=100)),
                ('field', models.CharField(max_length=100)),
                ('filter_type', models.CharField(choices=[('text', 'Text'), ('number', 'Number'), ('date', 'Date'), ('boolean', 'Boolean'), ('choice', 'Choice'), ('range', 'Range')], max_length=20)),
                ('choices', models.JSONField(blank=True, help_text='Options pour les filtres de type choice', null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('order', models.IntegerField(default=0)),
            ],
            options={
                'ordering': ['category', 'order'],
                'unique_together': {('category', 'field')},
            },
        ),
        migrations.CreateModel(
            name='SearchQuery',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('query', models.CharField(max_length=255)),
                ('category', models.CharField(blank=True, choices=[('course', 'Course'), ('startup', 'Startup'), ('project', 'Project'), ('competition', 'Competition'), ('resource', 'Resource'), ('user', 'User'), ('organization', 'Organization')], max_length=20, null=True)),
                ('filters', models.JSONField(blank=True, null=True)),
                ('results_count', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('ip_address', models.GenericIPAddressField(blank=True, null=True)),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
                'indexes': [
                    models.Index(fields=['-created_at'], name='search_sear_created_788c5c_idx'),
                    models.Index(fields=['query'], name='search_sear_query_179c3e_idx'),
                ],
            },
        ),
        migrations.CreateModel(
            name='SearchIndex',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('content', models.TextField()),
                ('summary', models.TextField(blank=True)),
                ('keywords', models.TextField(blank=True, help_text='Comma-separated keywords')),
                ('object_id', models.PositiveIntegerField()),
                ('category', models.CharField(choices=[('course', 'Course'), ('startup', 'Startup'), ('project', 'Project'), ('competition', 'Competition'), ('resource', 'Resource'), ('user', 'User'), ('organization', 'Organization')], max_length=20)),
                ('url', models.URLField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('search_vector', models.JSONField(blank=True, help_text='Stockage du vecteur de recherche', null=True)),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
            ],
            options={
                'ordering': ['-updated_at'],
                'indexes': [
                    models.Index(fields=['category'], name='search_sear_categor_f2c82d_idx'),
                    models.Index(fields=['content_type', 'object_id'], name='search_sear_content_179c3e_idx'),
                    models.Index(fields=['-updated_at'], name='search_sear_updated_788c5c_idx'),
                ],
            },
        ),
    ]
