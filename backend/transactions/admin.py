from django.contrib import admin
from .models import Transaction

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['user', 'category', 'amount', 'date', 'payment_method']
    list_filter = ['payment_method', 'date', 'category']
    search_fields = ['description', 'user__email']