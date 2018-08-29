# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-08-02 12:30


import uuid

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0019_auto_20170718_1743'),
    ]

    operations = [
        migrations.RenameField(
            model_name='exporttaskexception',
            old_name='timestamp',
            new_name='created_at',
        ),
        migrations.RemoveField(
            model_name='finalizerunhooktaskrecord',
            name='finished_at',
        ),
        migrations.RemoveField(
            model_name='finalizerunhooktaskrecord',
            name='started_at',
        ),
        migrations.AddField(
            model_name='exportprovidertask',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now, editable=False),
        ),
        migrations.AddField(
            model_name='exportprovidertask',
            name='finished_at',
            field=models.DateTimeField(editable=False, null=True),
        ),
        migrations.AddField(
            model_name='exportprovidertask',
            name='started_at',
            field=models.DateTimeField(default=django.utils.timezone.now, editable=False),
        ),
        migrations.AddField(
            model_name='exportprovidertask',
            name='updated_at',
            field=models.DateTimeField(default=django.utils.timezone.now, editable=False),
        ),
        migrations.AlterField(
            model_name='exporttask',
            name='started_at',
            field=models.DateTimeField(default=django.utils.timezone.now, editable=False),
        ),
        migrations.AddField(
            model_name='exportrun',
            name='updated_at',
            field=models.DateTimeField(default=django.utils.timezone.now, editable=False),
        ),
        migrations.AddField(
            model_name='exporttask',
            name='updated_at',
            field=models.DateTimeField(default=django.utils.timezone.now, editable=False),
        ),
        migrations.AddField(
            model_name='exporttaskexception',
            name='updated_at',
            field=models.DateTimeField(default=django.utils.timezone.now, editable=False),
        ),
        migrations.AddField(
            model_name='finalizerunhooktaskrecord',
            name='uid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, null=True),
        ),
        migrations.AddField(
            model_name='finalizerunhooktaskrecord',
            name='updated_at',
            field=models.DateTimeField(default=django.utils.timezone.now, editable=False),
        ),
    ]
