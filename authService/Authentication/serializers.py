from rest_framework import serializers
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from rest_auth.registration.serializers import RegisterSerializer
from Authentication.models import CustomUser

class MyRegistrationSerializer(RegisterSerializer):
    first_name = serializers.CharField(required=True, write_only=True)
    last_name = serializers.CharField(required=True, write_only=True)

    def get_cleaned_data(self):
        return {
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
            'username': self.validated_data.get('username', ''),
            'address1': self.validated_data.get('address1', ''),
            'address1': self.validated_data.get('address1', ''),
            'city': self.validated_data.get('city', ''),
            'country': self.validated_data.get('country', 'US'),
            'latitude': self.validated_data.get('latitude', 0),
            'longitude': self.validated_data.get('longitude', 0),
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        adapter.save_user(request, user, self)
        setup_user_email(request, user, [])
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ('id','email', 'first_name', 'last_name', 'username', 'address1', 'address2', 'city',  'country', 'latitude', 'longitude')
