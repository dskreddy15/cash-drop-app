from rest_framework import serializers
from .models import CashDrawer, CashDrop

class CashDrawerSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)

    class Meta:
        model = CashDrawer
        fields = [
            'id', 'user_name', 'workstation', 'shift_number', 'date', 'starting_cash',
            'hundreds', 'fifties', 'twenties', 'tens', 'fives', 'twos', 'ones',
            'half_dollars', 'quarters', 'dimes', 'nickels', 'pennies', 'total_cash', 'created_at'
        ]

class CashDropSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    drawer_entry = serializers.PrimaryKeyRelatedField(queryset=CashDrawer.objects.all())

    class Meta:
        model = CashDrop
        fields = [
            'id', 'user_name', 'drawer_entry', 'workstation', 'shift_number', 'date', 'drop_amount',
            'hundreds', 'fifties', 'twenties', 'tens', 'fives', 'twos', 'ones',
            'half_dollars', 'quarters', 'dimes', 'nickels', 'pennies', 'created_at'
        ]