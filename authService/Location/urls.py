from rest_framework import routers
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from Location import views

# Create a router and register our viewsets with it.



urlpatterns = [
    path('employee/', views.EmployeeView.as_view(), name='employee'),
    path('websocket/', views.get_websocket_token.as_view(), name='websocket'),
]