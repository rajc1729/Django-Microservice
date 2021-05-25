from rest_framework import serializers
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from rest_auth.registration.serializers import RegisterSerializer
from Authentication.models import CustomUser, Employer, Employee
from django.db import transaction
from django.utils.translation import ugettext_lazy as _
from pymongo import MongoClient

mongoClient = MongoClient(host="localhost", port=27017)
db = mongoClient.location

class MyRegistrationSerializer(RegisterSerializer):
    first_name = serializers.CharField(required=True, write_only=True)
    last_name = serializers.CharField(required=True, write_only=True)
    address1 = serializers.CharField(required=True)
    address2 = serializers.CharField(required=False)
    city = serializers.CharField(required=True)
    country = serializers.CharField(required=True)
    latitude = serializers.FloatField(required=True)
    longitude = serializers.FloatField(required=True)
    type = serializers.CharField(required=True)

    company_name = serializers.CharField(required=False)


    def get_cleaned_data(self):
        return {
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
            'username': self.validated_data.get('username', ''),
            'address1': self.validated_data.get('address1', ''),
            'address2': self.validated_data.get('address2', ''),
            'city': self.validated_data.get('city', ''),
            'country': self.validated_data.get('country', 'US'),
            'latitude': self.validated_data.get('latitude', 0),
            'longitude': self.validated_data.get('longitude', 0),
            'type': self.validated_data.get('type', 'employer'),
            'company_name': self.validated_data.get('company_name', ''),
        }
    
    
    
    def validate(self, data):
        super().validate(data)

        if data['type']=='employer':
            if 'company_name' not in data:
                raise serializers.ValidationError(_("company_name is required."))
            # add error chec for same companey
        elif data['type'] == 'employee':
            if 'company_name' not in data:
                raise serializers.ValidationError(_("company_name is required."))
            # add error check for whether employeer is there
            else:
                self.employer = Employer.objects.filter(company_name=data['company_name'])
                if not self.employer.exists():
                    raise serializers.ValidationError(_("company_name is not valid."))
                else:
                    self.employer = self.employer[0]

        return data
    
    @transaction.atomic
    def save(self, request):
        # employer
        type = request.data.get('type')
        company_name = request.data.get('company_name')

        adapter = get_adapter()
        user = adapter.new_user(request)

        
        if type=='employer':
            user.is_employer = True
            self.cleaned_data = self.get_cleaned_data()
            adapter.save_user(request, user, self, commit=True)
            setup_user_email(request, user, [])
            Employer.objects.create(user = user, company_name = company_name)
        else:
            user.is_employee = True
            self.cleaned_data = self.get_cleaned_data()
            adapter.save_user(request, user, self, commit=True)
            setup_user_email(request, user, [])
            Employee.objects.create(user = user, employer = self.employer)
            
            collection = db[str(company_name)]


            mongoData = {
                'first_name' : self.cleaned_data['first_name'],
                'last_name' : self.cleaned_data['last_name'],
                'email' : self.cleaned_data['email'],
                'username' : self.cleaned_data['username'],
                'address1' : self.cleaned_data['address1'],
                'address2' : self.cleaned_data['address2'],
                'city' : self.cleaned_data['city'],
                'country' : self.cleaned_data['country'],
                'latitude' : self.cleaned_data['latitude'],
                'longitude' : self.cleaned_data['longitude'],
                'country' : self.cleaned_data['country'],
                'company_name' : self.cleaned_data['company_name'],
            }
            collection.insert_one(mongoData)
    
        return user

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ('id','email', 'first_name', 'last_name', 'username', 'address1', 'address2', 'city',  'country', 'latitude', 'longitude', 'is_employer', 'is_employee')
