from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Post, Comment, Reaction, Event
from .serializers import PostSerializer, CommentSerializer, ReactionSerializer, EventSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def comment(self, request, pk=None):
        post = self.get_object()
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, post=post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def react(self, request, pk=None):
        post = self.get_object()
        reaction_type = request.data.get('reaction_type')
        if not reaction_type:
            return Response({'error': 'reaction_type is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        reaction, created = Reaction.objects.update_or_create(
            user=request.user,
            post=post,
            defaults={'reaction_type': reaction_type}
        )
        return Response({'status': 'reacted', 'type': reaction_type}, status=status.HTTP_200_OK)

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-start_time')
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

    @action(detail=True, methods=['post'])
    def attend(self, request, pk=None):
        event = self.get_object()
        if request.user in event.attendees.all():
            event.attendees.remove(request.user)
            return Response({'status': 'unattended'}, status=status.HTTP_200_OK)
        else:
            event.attendees.add(request.user)
            return Response({'status': 'attending'}, status=status.HTTP_200_OK)
