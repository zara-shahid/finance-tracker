from rest_framework import serializers
from .models import Budget
from categories.serializers import CategorySerializer

class BudgetSerializer(serializers.ModelSerializer):
    category_details = CategorySerializer(source='category', read_only=True)
    
    class Meta:
        model = Budget
        fields = ['id', 'category', 'category_details', 'amount', 'month', 'year', 
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)