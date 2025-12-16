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
        # Return conversations where user is p1 OR p2
        return Conversation.objects.filter(
            Q(participant_1=self.request.user) | Q(participant_2=self.request.user)
        ).distinct().order_by('-updated_at')

    @action(detail=False, methods=['post'])
    def start(self, request):
        recipient_id = request.data.get('recipient_id')
        if not recipient_id:
            return Response({'error': 'recipient_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            recipient = User.objects.get(id=recipient_id)
        except User.DoesNotExist:
            return Response({'error': 'Recipient not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if recipient == request.user:
            return Response({'error': 'Cannot message yourself'}, status=status.HTTP_400_BAD_REQUEST)

        # Check for existing conversation (order insensitive)
        conversation = Conversation.objects.filter(
            Q(participant_1=request.user, participant_2=recipient) |
            Q(participant_1=recipient, participant_2=request.user)
        ).first()
        
        if not conversation:
            conversation = Conversation.objects.create(
                participant_1=request.user,
                participant_2=recipient
            )
        
        return Response(ConversationSerializer(conversation).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        conversation = self.get_object()
        
        # Verify participation
        if request.user != conversation.participant_1 and request.user != conversation.participant_2:
            return Response({'error': 'Not a participant'}, status=status.HTTP_403_FORBIDDEN)

        text = request.data.get('text', '')
        message_type = request.data.get('message_type', 'text')
        media_url = request.data.get('media_url')

        if not text and not media_url:
            return Response({'error': 'Text or media_url is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            text=text,
            message_type=message_type,
            media_url=media_url
        )
        
        # Update conversation timestamp
        conversation.save() # Updates updated_at auto_now
        # Also update manual sort field if needed, but updated_at usually suffices if model configured right.
        # attributes last_message_at
        conversation.update_last_message(message)
        
        return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        conversation = self.get_object()
        if request.user != conversation.participant_1 and request.user != conversation.participant_2:
            return Response({'error': 'Not a participant'}, status=status.HTTP_403_FORBIDDEN)
            
        messages = conversation.messages.all().order_by('created_at')
        return Response(MessageSerializer(messages, many=True).data)

