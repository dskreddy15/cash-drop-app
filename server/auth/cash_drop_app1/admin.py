from django.contrib import admin
from .models import CashDrawer, CashDrop

@admin.register(CashDrawer)
class CashDrawerAdmin(admin.ModelAdmin):
    list_display = ('workstation', 'shift_number', 'date', 'user', 'total_cash')
    list_filter = ('date', 'user')
    search_fields = ('workstation', 'shift_number')

@admin.register(CashDrop)
class CashDropAdmin(admin.ModelAdmin):
    list_display = ('workstation', 'shift_number', 'date', 'user', 'drop_amount')
    list_filter = ('date', 'user')
    search_fields = ('workstation', 'shift_number')