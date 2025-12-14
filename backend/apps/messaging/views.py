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

        # Check if PRIVATE conversation already exists (is_group=False)
        conversation = Conversation.objects.filter(is_group=False).filter(participants=request.user).filter(participants=recipient).first()
        
        if not conversation:
            conversation = Conversation.objects.create(is_group=False)
            conversation.participants.add(request.user, recipient)
        
        return Response(ConversationSerializer(conversation).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def create_group(self, request):
        name = request.data.get('name')
        participant_ids = request.data.get('participant_ids', [])
        group_image = request.data.get('group_image')
        
        if not name:
            return Response({'error': 'Group name is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        conversation = Conversation.objects.create(is_group=True, name=name, group_image=group_image)
        conversation.participants.add(request.user)
        conversation.admins.add(request.user)
        
        if participant_ids:
            participants = User.objects.filter(id__in=participant_ids)
            conversation.participants.add(*participants)
            
        return Response(ConversationSerializer(conversation).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        conversation = self.get_object()
        content = request.data.get('content', '')
        message_type = request.data.get('message_type', 'text')
        attachment_url = request.data.get('attachment_url')

        if not content and not attachment_url:
            return Response({'error': 'Content or attachment is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            content=content,
            message_type=message_type,
            attachment_url=attachment_url
        )
        # Update conversation timestamp
        conversation.save()
        
        return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        conversation = self.get_object()
        messages = conversation.messages.all().order_by('created_at')
        return Response(MessageSerializer(messages, many=True).data)

    @action(detail=True, methods=['post'])
    def add_members(self, request, pk=None):
        conversation = self.get_object()
        if not conversation.is_group:
             return Response({'error': 'Not a group chat'}, status=status.HTTP_400_BAD_REQUEST)
        if request.user not in conversation.admins.all():
            return Response({'error': 'Only admins can add members'}, status=status.HTTP_403_FORBIDDEN)
            
        user_ids = request.data.get('user_ids', [])
        users = User.objects.filter(id__in=user_ids)
        conversation.participants.add(*users)
        return Response({'status': 'Members added'})

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        conversation = self.get_object()
        if not conversation.is_group:
             return Response({'error': 'Cannot leave a DM'}, status=status.HTTP_400_BAD_REQUEST)
        
        conversation.participants.remove(request.user)
        if conversation.admins.filter(id=request.user.id).exists():
            conversation.admins.remove(request.user)
            # If no admins left, assign random or delete? For now, just remove.
            
        return Response({'status': 'Left group'})
