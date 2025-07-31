# auth_app/serializers.py (create this file if it doesn't exist in your auth_app)
from rest_framework import serializers
from .models import User # Assuming your custom user model is in .models

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'is_admin'] # Include 'id'
        read_only_fields = ['email'] # Often email is read-only after creation