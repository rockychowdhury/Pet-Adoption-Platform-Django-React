
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated], url_path='reviews/(?P<review_id>[^/.]+)/respond')
    def respond_to_review(self, request, pk=None, review_id=None):
        """Allow provider to respond to a review"""
        provider = self.get_object()
        
        # Check provider owns this profile
        if provider.user != request.user:
            return Response({"error": "Not authorized"}, status=403)
        
        try:
            review = ServiceReview.objects.get(id=review_id, provider=provider)
        except ServiceReview.DoesNotExist:
            return Response({"error": "Review not found"}, status=404)
        
        response_text = request.data.get('response')
        if not response_text:
            return Response({"error": "Response text is required"}, status=400)
        
        # Update review with response
        from django.utils import timezone
        review.provider_response = response_text
        review.response_date = timezone.now()
        review.save()
        
        serializer = ServiceReviewSerializer(review)
        return Response(serializer.data)
