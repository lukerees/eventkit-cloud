# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-17 17:55


import django.contrib.postgres.fields.jsonb
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0012_auto_20170413_0124'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='exportconfig',
            name='user',
        ),
        migrations.RemoveField(
            model_name='job',
            name='configs',
        ),
        migrations.AddField(
            model_name='job',
            name='preset',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='jobs.DatamodelPreset'),
        ),
        migrations.AlterField(
            model_name='datamodelpreset',
            name='json_tags',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=list),
        ),
        migrations.AlterField(
            model_name='exportprovider',
            name='config',
            field=models.TextField(blank=True, default='', help_text="""WMS, TMS, WMTS, and ArcGIS-Raster require a MapProxy YAML configuration
                              with a Sources key of imagery and a Service Layer name of imagery; the validator also
                              requires a layers section, but this isn't used.
                              OSM Services also require a YAML configuration.""", null=True, verbose_name='Configuration'),
        ),
        migrations.DeleteModel(
            name='ExportConfig',
        ),
    ]
