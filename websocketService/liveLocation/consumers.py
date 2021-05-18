import logging
from channels.generic.websocket import JsonWebsocketConsumer, WebsocketConsumer
import redis
logger = logging.getLogger(__name__)
from urllib.parse import parse_qs
# from django.utils.timezone import utc
# import datetime
# from django.conf import settings
from pymongo import MongoClient


redisclient = redis.Redis(host='127.0.0.1', port=6379, db=5, charset="utf-8", decode_responses=True)
mongoClient = MongoClient(host="localhost", port=27017)
db = mongoClient.location

class liveEmployeeConsumer(JsonWebsocketConsumer):

    def _getData(self):
        data = []
        for employee in db[self.employer_name].find():
            employee["_id"] = str(employee["_id"])
            data.append(employee)
        return data


    def connect(self):
        query = parse_qs(self.scope['query_string'].decode('utf8'))

        if 'employer_name' not in query:
            raise ValueError(
            "employer_name not found"
            )

        self.employer_name = query['employer_name'][0]
        self.accept()
        data = self._getData()

        self.send_json({"data": data,  'status': 200})


    def receive(self, text_data=None, bytes_data=None):

        data = self._getData()

        self.send_json({"data": data,  'status': 200})

    # def disconnect(self, close_code=None):
    #     self._remove_user()
