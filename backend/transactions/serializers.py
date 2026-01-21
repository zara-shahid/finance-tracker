from rest_framework import serializers
from .models import Transaction
from categories.serializers import CategorySerializer

class TransactionSerializer(serializers.ModelSerializer):
    category_details = CategorySerializer(source='category', read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'category', 'category_details', 'amount', 'description', 
                  'date', 'payment_method', 'receipt', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)