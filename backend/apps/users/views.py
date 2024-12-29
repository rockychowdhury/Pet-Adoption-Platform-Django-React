from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken
from .serializers import UserRegistrationSerializer, UserUpdateSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from decouple import config


User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        refresh_token = response.data.get("refresh")
        # access_token = response.data.get('access')

        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            samesite="None",
            secure= True,
            max_age=7*24*60*60, #7days
        )
        response.data.pop("refresh",None)
        return response


class CustomTokenRefreshView(TokenRefreshView):
    def post (self,request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            response = Response({"message":"Refresh token not provided",'code':'invalid-refresh-token'}, status=401)
            print(response)
            return response
        try:
            token = RefreshToken(refresh_token)
            access_token = str(token.access_token)
            return Response({"access":access_token})
        except InvalidToken:
            return Response({"message":"Invalid refresh token",'code':'invalid-refresh-token'},status=401)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "email": user.email,
            "role": user.role,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone_number": user.phone_number,
            "profile_picture": user.profile_picture,
        })




class UserRegistrationView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            response_data = {
                "message": "User created successfully",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "role": user.role,
                },
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user= request.user
        serializer = UserUpdateSerializer(user, data = request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Profile updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LogoutView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            else:
                return Response({"error":"Refresh token is missing"},status=400)
            response =  Response({"message":"Logout successful"},status=200)
            response.delete_cookie('refresh_token')
            return response
        except Exception as e:
            return Response({"error": "Invalid token"}, status=400)
        
class UserDeactivateView(APIView):
    permission_classes = [IsAuthenticated]
    def patch(self,request):
        user = request.user
        user.is_active = False
        user.save()
        return Response({"message": "Account has been deactivated."})

class UserActivateView(APIView):
    permission_classes = [AllowAny]
    def patch(self,request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = User.objects.get(email=email)

        if not user.check_password(password):
            return Response(
                {"error": "password is incorrect."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        user.is_active = True
        user.save()

        return Response(
            {"message": "Account activated successfully."},
            status=status.HTTP_200_OK
        )

class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return Response(
                {"error": "The old password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            validate_password(new_password,user)
        except ValidationError as e:
            return Response(
                {"error": e.messages},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.set_password(new_password)
        user.save()

        return Response(
            {"message": "Password updated successfully."},
            status=status.HTTP_200_OK
        )