from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('search', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            # Forward SQL - Create new indexes
            """
            CREATE INDEX IF NOT EXISTS search_sear_categor_dc6fcb_idx ON search_searchindex(category);
            CREATE INDEX IF NOT EXISTS search_sear_content_97a989_idx ON search_searchindex(content);
            CREATE INDEX IF NOT EXISTS search_sear_updated_933de0_idx ON search_searchindex(updated_at);
            CREATE INDEX IF NOT EXISTS search_sear_created_29f94e_idx ON search_searchquery(created_at);
            CREATE INDEX IF NOT EXISTS search_sear_query_eedf16_idx ON search_searchquery(query);
            """,
            # Reverse SQL - Drop new indexes
            """
            DROP INDEX IF EXISTS search_sear_categor_dc6fcb_idx;
            DROP INDEX IF EXISTS search_sear_content_97a989_idx;
            DROP INDEX IF EXISTS search_sear_updated_933de0_idx;
            DROP INDEX IF EXISTS search_sear_created_29f94e_idx;
            DROP INDEX IF EXISTS search_sear_query_eedf16_idx;
            """
        )
    ]
