from rest_framework import serializers
from .models import UserReport
from apps.users.serializers import UserSerializer

class UserReportSerializer(serializers.ModelSerializer):
    reporter_email = serializers.EmailField(source='reporter.email', read_only=True)
    reported_user_email = serializers.EmailField(source='reported_user.email', read_only=True)

    class Meta:
        model = UserReport
        fields = [
            'id', 'reporter', 'reporter_email', 'reported_user', 'reported_user_email',
            'reported_content_type', 'reported_content_id',
            'report_type', 'description', 'status', 'admin_notes', 'created_at', 'resolved_at'
        ]
        read_only_fields = ['reporter', 'created_at', 'resolved_at']

from apps.rehoming.models import AdoptionContract

class AdoptionContractSerializer(serializers.ModelSerializer):
    pet_owner_name = serializers.CharField(source='application.pet.owner.get_full_name', read_only=True)
    adopter_name = serializers.CharField(source='application.applicant.get_full_name', read_only=True)
    
    class Meta:
        model = AdoptionContract
        fields = [
            'id', 'application', 'contract_template', 'document_pdf_url',
            'pet_owner_signed_at', 'adopter_signed_at', 'is_fully_signed',
            'pet_owner_name', 'adopter_name', 'created_at'
        ]
