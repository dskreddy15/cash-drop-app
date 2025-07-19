from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView, UserView, UserListView, UserDetailView, LogoutView

app_name = 'auth_app'

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('users/me/', UserView.as_view(), name='user_me'),
    path('users/', UserListView.as_view(), name='user_list'),
    path('users/<int:id>/', UserDetailView.as_view(), name='user_detail'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]