from rest_framework import serializers
from Authentication.serializers import UserSerializer
from Authentication.models import Employee, Employer

class EmployerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Employer
        fields = ( "user","company_name")

class EmployeeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    employer = EmployerSerializer(read_only=True)
    class Meta:
        model = Employee
        fields = ( "user","employer")