import os
from celery import Celery
from datetime import timedelta
from django.conf import settings

# from celery.utils.log import get_task_logger
# logger = get_task_logger(__name__)


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "websocketService.settings")

app = Celery("websocketService")
app.config_from_object(settings, namespace="CELERY")




app.conf.timezone = 'UTC' 
app.autodiscover_tasks()