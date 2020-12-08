# Generated by Django 2.2.10 on 2020-12-07 23:51

from django.db import migrations
import json_field.fields


class Migration(migrations.Migration):

    dependencies = [
        ('poll', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='questionmodel',
            name='questionData',
            field=json_field.fields.JSONField(default='null', help_text='Enter a valid JSON object', null=True),
        ),
    ]
