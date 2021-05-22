from celery import shared_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@shared_task(name='realtime_task')
def RealTimeTask():


    channel_layer = get_channel_layer()
    print(channel_layer)
    print("send_push_notification_celery")
    message = {'type': 'notify', "data": "abc"}
    # testing phase 
    async_to_sync(channel_layer.group_send)('csuf', message)