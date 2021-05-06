from django.contrib import admin
from Authentication.models import CustomUser, Employer, Employee

# Register your models here.
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['username','first_name','last_name','email', 'address1', 'address2', 'city',  'country', 'latitude', 'longitude']

class EmployerAdmin(admin.ModelAdmin):
    list_display = ['user', 'company_name']


class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['user', 'employer']


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Employee, EmployeeAdmin)
admin.site.register(Employer, EmployerAdmin)
