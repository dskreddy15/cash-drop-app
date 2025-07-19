import pyotp
import qrcode
import io
import base64
from django.core.files.base import ContentFile
from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from .models import User

class LoginView(views.APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get('email')
        totp_code = request.data.get('totp_code')
        try:
            user = User.objects.get(email=email)
            totp = pyotp.TOTP(user.totp_secret)
            if totp.verify(totp_code):
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'is_admin': user.is_admin
                }, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid TOTP code'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class UserView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'name': user.name,
            'email': user.email,
            'is_admin': user.is_admin
        }, status=status.HTTP_200_OK)

class UserListView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.all()
        return Response([{
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'is_admin': user.is_admin
        } for user in users])

    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        is_admin = request.data.get('isAdmin', False)

        if not name or not email:
            return Response({'error': 'Name and email are required'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            secret = pyotp.random_base32()
            user = User.objects.create_user(email=email, name=name, is_admin=is_admin)
            user.totp_secret = secret
            user.save()

            totp_uri = pyotp.totp.TOTP(secret).provisioning_uri(name=email, issuer_name='TOTP App')
            qr = qrcode.QRCode()
            qr.add_data(totp_uri)
            qr.make(fit=True)
            img = qr.make_image(fill_color="black", back_color="white")
            buffer = io.BytesIO()
            img.save(buffer, format="PNG")
            qr_code_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

            return Response({
                'secret': secret,
                'qr_code': f'data:image/png;base64,{qr_code_base64}'
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserDetailView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        try:
            user = User.objects.get(id=id)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class LogoutView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            print(refresh_token)
            token = RefreshToken(refresh_token)
            print(token)
            token.blacklist()
            return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)