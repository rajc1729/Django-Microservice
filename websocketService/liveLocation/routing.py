from django.urls import path
from .consumers import liveEmployeeConsumer


liveEmployee_v1_websocket_urlpatterns = [
    path('liveEmployeeV1', liveEmployeeConsumer.as_asgi()),
]