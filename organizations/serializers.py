from rest_framework import serializers
from .models import Organization, CallForProject, Competition, Submission
from users.serializers import UserSerializer

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = (
            'id', 'name', 'description', 'type', 'sector', 'location',
            'website', 'logo', 'is_active', 'contact_email', 'contact_phone',
            'founding_date', 'stage', 'team_size', 'funding_raised',
            'pitch_deck', 'social_links', 'market_size', 'revenue',
            'patents', 'tech_stack'
        )

    def validate(self, data):
        if data.get('type') == 'startup':
            required_fields = ['founding_date', 'stage']
            missing_fields = [field for field in required_fields if not data.get(field)]
            if missing_fields:
                raise serializers.ValidationError({
                    'error': f'Les champs suivants sont requis pour une startup : {", ".join(missing_fields)}'
                })
            
            if data.get('team_size', 0) < 1:
                raise serializers.ValidationError({
                    'team_size': 'La taille de l\'équipe doit être d\'au moins 1 personne'
                })

        return data

class StartupSerializer(OrganizationSerializer):
    class Meta(OrganizationSerializer.Meta):
        fields = OrganizationSerializer.Meta.fields

    def validate(self, data):
        data['type'] = 'startup'
        return super().validate(data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.tech_stack:
            data['tech_stack_details'] = self.get_tech_stack_details(instance.tech_stack)
        return data

    def get_tech_stack_details(self, tech_stack):
        # Ici vous pouvez ajouter une logique pour enrichir les informations
        # sur la stack technique, par exemple en récupérant des détails depuis
        # une API externe ou une base de données
        return tech_stack

class CallForProjectSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(read_only=True)

    class Meta:
        model = CallForProject
        fields = (
            'id', 'organization', 'title', 'description', 'requirements',
            'status', 'start_date', 'end_date', 'budget_min', 'budget_max'
        )

class CompetitionSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(read_only=True)
    
    class Meta:
        model = Competition
        fields = (
            'id', 'organization', 'title', 'description', 'rules',
            'status', 'start_date', 'end_date', 'prize_description',
            'max_participants', 'eligibility_criteria', 'registration_deadline'
        )

class SubmissionSerializer(serializers.ModelSerializer):
    submitter = UserSerializer(read_only=True)
    competition = CompetitionSerializer(read_only=True)

    class Meta:
        model = Submission
        fields = (
            'id', 'competition', 'submitter', 'title', 'description',
            'file', 'url', 'status', 'score', 'feedback', 'submitted_at'
        )
        read_only_fields = ('submitted_at',)
