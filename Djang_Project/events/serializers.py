from rest_framework import serializers
from .models import Event, EventRegistration, EventSpeaker, EventFeedback

class EventSpeakerSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventSpeaker
        fields = '__all__'

class EventFeedbackSerializer(serializers.ModelSerializer):
    participant_name = serializers.CharField(source='participant.username', read_only=True)
    
    class Meta:
        model = EventFeedback
        fields = ['id', 'participant', 'participant_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['participant']
    
    def create(self, validated_data):
        validated_data['participant'] = self.context['request'].user
        return super().create(validated_data)

class EventRegistrationSerializer(serializers.ModelSerializer):
    participant_name = serializers.CharField(source='participant.username', read_only=True)
    
    class Meta:
        model = EventRegistration
        fields = ['id', 'event', 'participant', 'participant_name', 'status', 'registration_date', 'notes']
        read_only_fields = ['participant', 'registration_date']
    
    def create(self, validated_data):
        validated_data['participant'] = self.context['request'].user
        return super().create(validated_data)

class EventSerializer(serializers.ModelSerializer):
    speakers = EventSpeakerSerializer(many=True, read_only=True)
    registrations_count = serializers.IntegerField(source='registrations.count', read_only=True)
    is_registered = serializers.SerializerMethodField()
    organizer_name = serializers.CharField(source='organizer.username', read_only=True)
    average_rating = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'category', 'start_date', 'end_date',
            'location', 'is_virtual', 'meeting_link', 'max_participants',
            'organizer', 'organizer_name', 'created_at', 'updated_at', 'image',
            'is_featured', 'speakers', 'registrations_count', 'is_registered',
            'average_rating'
        ]
        read_only_fields = ['organizer', 'created_at', 'updated_at']
    
    def get_is_registered(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.registrations.filter(participant=request.user).exists()
        return False
    
    def get_average_rating(self, obj):
        ratings = obj.feedback.all().values_list('rating', flat=True)
        if ratings:
            return sum(ratings) / len(ratings)
        return None
    
    def create(self, validated_data):
        validated_data['organizer'] = self.context['request'].user
        return super().create(validated_data)
