from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.conversations.all().order_by('-updated_at')

    @action(detail=False, methods=['post'])
    def start(self, request):
        recipient_id = request.data.get('recipient_id')
        if not recipient_id:
            return Response({'error': 'recipient_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            recipient = User.objects.get(id=recipient_id)
        except User.DoesNotExist:
            return Response({'error': 'Recipient not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check if conversation already exists
        conversation = Conversation.objects.filter(participants=request.user).filter(participants=recipient).first()
        
        if not conversation:
            conversation = Conversation.objects.create()
            conversation.participants.add(request.user, recipient)
        
        return Response(ConversationSerializer(conversation).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        conversation = self.get_object()
        content = request.data.get('content')
        if not content:
            return Response({'error': 'content is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            content=content
        )
        # Update conversation timestamp
        conversation.save()
        
        return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        conversation = self.get_object()
        messages = conversation.messages.all().order_by('created_at')
        return Response(MessageSerializer(messages, many=True).data)
