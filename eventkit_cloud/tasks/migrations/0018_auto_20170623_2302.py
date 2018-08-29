# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-06-23 23:02


import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0017_auto_20170623_0011'),
    ]

    operations = [
        migrations.AddField(
            model_name='finalizerunhooktaskrecord',
            name='result',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='task', to='tasks.FileProducingTaskResult'),
        ),
        migrations.AlterField(
            model_name='exporttask',
            name='result',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='new_task', to='tasks.FileProducingTaskResult'),
        ),
        migrations.AlterField(
            model_name='fileproducingtaskresult',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
