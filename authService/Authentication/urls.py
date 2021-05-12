from django.urls import path, include
from django.conf.urls import url
from dj_rest_auth.registration.views import VerifyEmailView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^accounts/', include('allauth.urls'), name='socialaccount_signup'),
    url(r'^rest-auth/', include('dj_rest_auth.urls')),
    url(r'^rest-auth/registration/', include('dj_rest_auth.registration.urls')),
]