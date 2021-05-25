import logging
from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer, WebsocketConsumer, AsyncJsonWebsocketConsumer
logger = logging.getLogger(__name__)
from urllib.parse import parse_qs
# from django.utils.timezone import utc
# import datetime
# from django.conf import settings
from pymongo import MongoClient


mongoClient = MongoClient(host="localhost", port=27017)
db = mongoClient.location


class liveEmployeeConsumer(AsyncJsonWebsocketConsumer):

    async def _getData(self):
        data = []
        for employee in db[self.employer_name].find():
            employee["_id"] = str(employee["_id"])
            data.append(employee)
        return data


    async def connect(self):
        query = parse_qs(self.scope['query_string'].decode('utf8'))

        if 'employer_name' not in query:
            raise ValueError(
            "employer_name not found"
            )
        
        self.employer_name = query['employer_name'][0]

        await self.channel_layer.group_add(
            self.employer_name,
            self.scope['user_uid']
        )
        await self.accept()
        data = await self._getData()
        await self.send_json({'data': data,  'status': 200})


    async def receive(self, text_data=None, bytes_data=None):
        data = await self._getData()
        await self.send_json({"data": data,  'status': 200})

    async def disconnect(self, close_code=None):
        await self.channel_layer.group_discard(
            self.employer_name,
            self.scope['user_uid']
        )
    
    async def notify(self, event):
        data = await self._getData()
        temp = event['data']
        await self.send_json({"data": data, "test": temp ,  'status': 200})

