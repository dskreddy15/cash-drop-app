from django.urls import path
from .views import CashDrawerView, CashDropView

app_name = 'cash_drop_app1'

urlpatterns = [
    path('cash-drawer/', CashDrawerView.as_view(), name='cash_drawer'),
    path('cash-drop/', CashDropView.as_view(), name='cash_drop'),
]