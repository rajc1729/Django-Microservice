from django.shortcuts import render
from rest_framework import generics
from Authentication.models import Employee, Employer
from .serializers import EmployeeSerializer
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import jwt
import time

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

class get_websocket_token(APIView):

    def create_token(self, user_uuid: str):

        now = int(time.time())
        token_lifetime = settings.WEBSOCKET_TOKEN_LIFETIME.total_seconds()

        payload = {
            'uid': user_uuid,
            'iat': now,
            'exp': now + int(token_lifetime),
        }
        return jwt.encode(payload, settings.WEBSOCKET_TOKEN_KEY)


    def get(self, request, *args, **kwargs):

        token = self.create_token(str(request.user.pk))
        employer = Employer.objects.filter(user=request.user).first()
        obj = {'websocket_token': token, 'company_name': employer.company_name}
        return Response(obj, status=status.HTTP_200_OK)