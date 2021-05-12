from django.shortcuts import render
from rest_framework import generics
from Authentication.models import Employee
from .serializers import EmployeeSerializer
from django.shortcuts import get_object_or_404

class EmployeeView(generics.RetrieveAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    # lookup_field = 'company_name' 

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, user=self.request.user)
        return obj


    # def get_object(self):
    #     queryset = self.get_queryset()
    #     company_name = self.request.GET.get(self.lookup_field, None)
    #     obj = get_object_or_404(queryset, company_name = company_name)
    #     return obj