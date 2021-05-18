
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from rest_framework_simplejwt.state import token_backend
from uuid import UUID
from urllib.parse import parse_qs
from django.contrib.auth.models import AnonymousUser
import jwt
from django.conf import settings


def get_user_uid(token_key):
    if not token_key: return

    decoded_data = jwt.decode(token_key, key=settings.WEBSOCKET_TOKEN_KEY)   
    
    return decoded_data['uid']

class TokenAuthMiddleware(BaseMiddleware):

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):

        query = parse_qs(scope['query_string'].decode('utf8'))
        token_key = query['token'][0]
        employer_name = query['employer_name'][0]

        if not token_key:
            raise ValueError(
            "Token not found"
            )

        scope['user'] = AnonymousUser()
        scope['user_uid'] = get_user_uid(token_key)
        scope['employer_name'] = employer_name
        
        return await super().__call__(scope, receive, send)