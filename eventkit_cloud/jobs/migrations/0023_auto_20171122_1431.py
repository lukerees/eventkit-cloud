# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-11-22 14:31


from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0022_job_original_selection'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='ExportProvider',
            new_name='DataProvider',
        ),
        migrations.RenameModel(
            old_name='ProviderTask',
            new_name='DataProviderTask',
        ),
        migrations.RenameModel(
            old_name='ExportProviderType',
            new_name='DataProviderType',
        ),
    ]
