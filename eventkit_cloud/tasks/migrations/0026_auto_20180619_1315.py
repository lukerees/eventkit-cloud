# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2018-06-19 13:15
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid
import os


download_url_root = settings.EXPORT_MEDIA_ROOT

def create_uuid(apps, schema_editor):
    FileProducingTaskResult = apps.get_model('tasks', 'FileProducingTaskResult')
    for downloadable in FileProducingTaskResult.objects.all():
        downloadable.uid = uuid.uuid4()
        downloadable.save()

def update_run_downloads(apps, schema_editor):
    ExportRun = apps.get_model('tasks', 'ExportRun')
    FileProducingTaskResult = apps.get_model('tasks', 'FileProducingTaskResult')
    for run in ExportRun.objects.all():

        zipfile_url = run.zipfile_url
        if zipfile_url:
            downloadable = FileProducingTaskResult.objects.create(
                download_url=os.path.join(download_url_root, zipfile_url))
            run.downloadable = downloadable
            run.save()

def reverse_run_downloads(apps, schema_editor):
    # if jobs were made public then they should be set to published.
    ExportRun = apps.get_model('tasks', 'ExportRun')
    for run in ExportRun.objects.all():
        run.zipfile_url = run.downloadable.download_url.lstrip(download_url_root)

class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('tasks', '0025_auto_20180213_2021'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserDownload',
            fields=[
                ('id', models.AutoField(editable=False, primary_key=True, serialize=False)),
                ('uid', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('downloaded_at', models.DateTimeField(default=django.utils.timezone.now, editable=False, verbose_name='Time of Download')),
            ],
            options={
                'ordering': ['-downloaded_at'],
            },
        ),
        migrations.RenameField(
            model_name='finalizerunhooktaskrecord',
            old_name='task_name',
            new_name='name',
        ),
        migrations.AddField(
            model_name='fileproducingtaskresult',
            name='uid',
            field=models.UUIDField(blank=True, null=True),
        ),
        migrations.RunPython(create_uuid),
        migrations.AlterField(
            model_name='fileproducingtaskresult',
            name='uid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, db_index=True, unique=True)
        ),
        migrations.AddField(
            model_name='userdownload',
            name='downloadable',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='downloads', to='tasks.FileProducingTaskResult'),
        ),
        migrations.AddField(
            model_name='userdownload',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='downloads', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='exportrun',
            name='downloadable',
            field=models.OneToOneField(related_name='run', null=True, on_delete=django.db.models.deletion.CASCADE,
                                    to='tasks.FileProducingTaskResult'),
        ),
        migrations.RunPython(update_run_downloads, reverse_code=reverse_run_downloads),
        migrations.RemoveField(
            model_name='exportrun',
            name='zipfile_url',
        ),
        migrations.AlterField(
            model_name='fileproducingtaskresult',
            name='id',
            field=models.AutoField(editable=False, primary_key=True, serialize=False),
        ),
    ]
