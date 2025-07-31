from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class CashDrawer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    workstation = models.CharField(max_length=50)
    shift_number = models.CharField(max_length=50)
    date = models.DateField()
    starting_cash = models.DecimalField(max_digits=10, decimal_places=2)
    hundreds = models.IntegerField(default=0)
    fifties = models.IntegerField(default=0)
    twenties = models.IntegerField(default=0)
    tens = models.IntegerField(default=0)
    fives = models.IntegerField(default=0)
    twos = models.IntegerField(default=0)
    ones = models.IntegerField(default=0)
    half_dollars = models.IntegerField(default=0)
    quarters = models.IntegerField(default=0)
    dimes = models.IntegerField(default=0)
    nickels = models.IntegerField(default=0)
    pennies = models.IntegerField(default=0)
    total_cash = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('workstation', 'shift_number', 'date')

class CashDrop(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    drawer_entry = models.ForeignKey(CashDrawer, on_delete=models.CASCADE, related_name='cash_drops')
    workstation = models.CharField(max_length=50)
    shift_number = models.CharField(max_length=50)
    date = models.DateField()
    drop_amount = models.DecimalField(max_digits=10, decimal_places=2)
    hundreds = models.IntegerField(default=0)
    fifties = models.IntegerField(default=0)
    twenties = models.IntegerField(default=0)
    tens = models.IntegerField(default=0)
    fives = models.IntegerField(default=0)
    twos = models.IntegerField(default=0)
    ones = models.IntegerField(default=0)
    half_dollars = models.IntegerField(default=0)
    quarters = models.IntegerField(default=0)
    dimes = models.IntegerField(default=0)
    nickels = models.IntegerField(default=0)
    pennies = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('workstation', 'shift_number', 'date')