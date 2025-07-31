from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import CashDrawer, CashDrop
from .serializers import CashDrawerSerializer, CashDropSerializer

class CashDrawerView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CashDrawerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        date = request.query_params.get('date')
        if not date:
            return Response({"error": "Date parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        if request.user.is_admin:
            drawers = CashDrawer.objects.filter(date=date)
        else:
            drawers = CashDrawer.objects.filter(date=date, user=request.user)

        serializer = CashDrawerSerializer(drawers, many=True)
        return Response(serializer.data)

class CashDropView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CashDropSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        date = request.query_params.get('date')
        if not date:
            return Response({"error": "Date parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        if request.user.is_admin:
            drops = CashDrop.objects.filter(date=date)
        else:
            drops = CashDrop.objects.filter(date=date, user=request.user)

        serializer = CashDropSerializer(drops, many=True)
        return Response(serializer.data)