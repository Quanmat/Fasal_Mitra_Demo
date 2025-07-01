import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import aiohttp
# from .rag_model import rag_model

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        user = self.scope["user"]

        # Check if the user is authenticated
        if user.is_authenticated:
            await self.accept()
            await self.send(text_data=json.dumps({
                'message': f'Welcome {user.first_name} {user.last_name}!'
            }))
        else:
            await self.close()

    async def disconnect(self, close_code):
        # Perform cleanup if needed
        pass

    async def get_response(self, message):
        return "Welcome"

    async def receive(self, text_data):
        user = self.scope["user"]
        text_data_json = json.loads(text_data)
        message = text_data_json.get('message', '')

        print(f"Received message from {user.email}: {message} length: {len(message)}")

        response = await self.get_response(message)

        await self.send(text_data=json.dumps({
            'message': response
        }))
