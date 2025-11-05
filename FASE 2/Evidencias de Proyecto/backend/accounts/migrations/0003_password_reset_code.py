from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0002_roles_and_marcos'),
    ]

    operations = [
        migrations.CreateModel(
            name='PasswordResetCode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254)),
                ('code', models.CharField(max_length=12)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('used_at', models.DateTimeField(blank=True, null=True)),
                ('expires_at', models.DateTimeField()),
            ],
        ),
        migrations.AddIndex(
            model_name='passwordresetcode',
            index=models.Index(fields=['email', 'code'], name='accounts_pa_email_c_0d7a22_idx'),
        ),
        migrations.AddIndex(
            model_name='passwordresetcode',
            index=models.Index(fields=['expires_at'], name='accounts_pa_expires_6f4e2d_idx'),
        ),
    ]

