# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-06-07 00:47


from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0010_auto_20170113_1704'),
    ]

    operations = [
        migrations.AddField(
            model_name='exportprovidertask',
            name='display',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='exporttask',
            name='display',
            field=models.BooleanField(default=False),
        ),
    ]
