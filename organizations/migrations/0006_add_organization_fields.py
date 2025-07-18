from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('organizations', '0005_add_organization_stage'),
    ]

    operations = [
        migrations.AddField(
            model_name='organization',
            name='team_size',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='organization',
            name='funding_raised',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=15, null=True),
        ),
        migrations.AddField(
            model_name='organization',
            name='pitch_deck',
            field=models.FileField(blank=True, null=True, upload_to='pitch_decks/'),
        ),
        migrations.AddField(
            model_name='organization',
            name='social_links',
            field=models.JSONField(blank=True, default=dict, null=True),
        ),
        migrations.AddField(
            model_name='organization',
            name='market_size',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=15, null=True),
        ),
        migrations.AddField(
            model_name='organization',
            name='revenue',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=15, null=True),
        ),
        migrations.AddField(
            model_name='organization',
            name='patents',
            field=models.IntegerField(blank=True, default=0),
        ),
        migrations.AddField(
            model_name='organization',
            name='tech_stack',
            field=models.JSONField(blank=True, default=list, null=True),
        ),
    ]
