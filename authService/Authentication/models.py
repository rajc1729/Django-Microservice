from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
from django_countries.fields import CountryField


class CustomUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # User Location
    address1 = models.TextField(blank=True, null=True, default="")
    address2 = models.TextField(blank=True, null=True, default="")
    city = models.CharField(max_length=100, blank=True, null=True, default="")
    country = CountryField(blank_label='(select country)', blank=True, default='US')
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    is_employer = models.BooleanField(default=False)
    is_employee = models.BooleanField(default=False)

class Employer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    company_name = models.CharField(unique=True, max_length = 50)

    def __str__(self):
        return self.company_name


class Employee(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    employer = models.ForeignKey(Employer, on_delete=models.CASCADE)