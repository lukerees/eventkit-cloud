# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-12-06 19:52


import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('tasks', '0006_merge'),
    ]

    operations = [
        migrations.AddField(
            model_name='exporttask',
            name='cancel_user',
            field=models.ForeignKey(blank=True, editable=False, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='exporttask',
            name='pid',
            field=models.IntegerField(blank=True, default=-1),
        ),
        migrations.AddField(
            model_name='exporttask',
            name='worker',
            field=models.CharField(blank=True, editable=False, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='exportrun',
            name='zipfile_url',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
    ]
