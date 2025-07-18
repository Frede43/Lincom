from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Mentor, Entrepreneur, Stakeholder

User = get_user_model()

class PasswordChangeSerializer(serializers.Serializer):
    """
    Serializer pour le changement de mot de passe
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Le mot de passe actuel est incorrect")
        return value

    def validate_new_password(self, value):
        validate_password(value)
        return value

class AvatarUploadSerializer(serializers.Serializer):
    """
    Serializer pour l'upload d'avatar
    """
    avatar = serializers.ImageField(required=True)

    def validate_avatar(self, value):
        if value.size > 5*1024*1024:  # 5MB
            raise serializers.ValidationError("L'image ne doit pas dépasser 5MB")
        return value

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle User
    """
    password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'bio', 'avatar', 'phone_number', 'address',
            'password', 'confirm_password', 'is_active',
            'date_joined', 'last_login'
        )
        read_only_fields = ('date_joined', 'last_login')

    def validate(self, attrs):
        if 'password' in attrs:
            if not attrs.get('confirm_password'):
                raise serializers.ValidationError({"confirm_password": "Ce champ est requis"})
            if attrs['password'] != attrs['confirm_password']:
                raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas"})
            validate_password(attrs['password'])
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        validated_data.pop('confirm_password', None)
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES)

    class Meta:
        model = User
        fields = (
            'username', 'email', 'password', 'confirm_password',
            'first_name', 'last_name', 'role', 'bio', 'phone_number'
        )

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        role = validated_data.pop('role')
        
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.role = role
        user.save()

        # Create corresponding profile based on role
        if role == 'mentor':
            Mentor.objects.create(user=user)
        elif role == 'entrepreneur':
            Entrepreneur.objects.create(user=user)
        elif role == 'stakeholder':
            Stakeholder.objects.create(user=user)

        return user

class MentorSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle Mentor
    """
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='mentor'),
        source='user',
        write_only=True
    )

    class Meta:
        model = Mentor
        fields = '__all__'

    def validate_user_id(self, value):
        if value.role != 'mentor':
            raise serializers.ValidationError("L'utilisateur doit avoir le rôle 'mentor'")
        return value

class EntrepreneurSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle Entrepreneur
    """
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='entrepreneur'),
        source='user',
        write_only=True
    )

    class Meta:
        model = Entrepreneur
        fields = '__all__'

    def validate_user_id(self, value):
        if value.role != 'entrepreneur':
            raise serializers.ValidationError("L'utilisateur doit avoir le rôle 'entrepreneur'")
        return value

class StakeholderSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle Stakeholder
    """
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='stakeholder'),
        source='user',
        write_only=True
    )

    class Meta:
        model = Stakeholder
        fields = '__all__'

    def validate_user_id(self, value):
        if value.role != 'stakeholder':
            raise serializers.ValidationError("L'utilisateur doit avoir le rôle 'stakeholder'")
        return value
