# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-05-16 17:30


from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0015_auto_20170510_1925'),
    ]

    operations = [
        migrations.AddField(
            model_name='exportprovider',
            name='zip',
            field=models.BooleanField(default=False),
        ),
    ]
