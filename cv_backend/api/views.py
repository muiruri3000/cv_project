from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, BasePermission, SAFE_METHODS
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework import viewsets, status
import json
import logging
import time
from django.core.cache import cache
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import MyTokenObtainPairSerializer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_ratelimit.decorators import ratelimit
from django_ratelimit.core import is_ratelimited
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.http import JsonResponse

from .serializers import UserSerializer, UserProfileSerializer
from .models import (
    Profile,
    Experience,
    Education,
    About,
    Hero,
    SkillCategory,
    FeaturedProject,
    SoftSkill,
    Architecture,
    Article,
    UserProfile,
)
from .serializers import (
    ProfileSerializer,
    AboutSerializer,
    ExperienceSerializer,
    EducationSerializer,
    HeroSerializer,
    FeaturedProjectSerializer,
    SkillCategorySerializer,
    SoftSkillSerializer,
    ArchitectureSerializer,
    ArticleSerializer,
    UserSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer,
)
from rest_framework import viewsets, status

logger = logging.getLogger(__name__)


class RoleBasedPermission(BasePermission):
    "Custom permission to allow read-only access to unauthenticated users and full access to authenticated users."

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return (
                request.method in SAFE_METHODS
            )  # Allow read-only for unauthenticated users

        user_role = request.user.profile.role
        role_permissions = getattr(view, "role_permissions", {})
        allowed_roles = role_permissions.get(request.method, [])
        return user_role in allowed_roles


class RoleProtectedViewSet(viewsets.ModelViewSet):
    role_permissions = {
        "GET": ["admin", "editor", "viewer"],
        "POST": ["admin", "editor"],
        "PUT": ["admin", "editor"],
        "PATCH": ["admin", "editor"],
        "DELETE": ["admin"],
    }
    permission_classes = [RoleBasedPermission]


class PublicProfileViewSet(RoleProtectedViewSet):
    serializer_class = ProfileSerializer
    permission_classes = [RoleBasedPermission]

    def get_queryset(self):
        # Always return at most ONE profile
        return Profile.objects.all()[:1]

    def list(self, request, *args, **kwargs):
        profile = Profile.objects.first()
        if not profile:
            return Response({}, status=status.HTTP_200_OK)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        # Prevent creating new profiles
        return Response(
            {"detail": "Profile creation not allowed"},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def update(self, request, *args, **kwargs):
        profile = Profile.objects.first()
        if not profile:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        serializer = self.get_serializer(profile, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        profile = Profile.objects.first()
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ExperienceViewSet(RoleProtectedViewSet):
    serializer_class = ExperienceSerializer

    def get_queryset(self):
        profile = Profile.objects.first()
        if profile:
            return Experience.objects.filter(profile=profile)
        return Experience.objects.none()

    def perform_create(self, serializer):
        profile = Profile.objects.first()
        if not profile:
            raise ValueError("No profile exists to associate with experience.")
        serializer.save(profile=profile)


class EducationViewSet(RoleProtectedViewSet):
    serializer_class = EducationSerializer

    def get_queryset(self):
        profile = Profile.objects.first()
        if profile:
            return Education.objects.filter(profile=profile)
        return Education.objects.none()

    def perform_create(self, serializer):
        profile = Profile.objects.first()
        if not profile:
            raise ValueError("No profile exists to associate with Education.")
        serializer.save(profile=profile)


class AboutViewSet(RoleProtectedViewSet):
    serializer_class = AboutSerializer

    def get_queryset(self):
        profile = Profile.objects.first()
        if profile:
            return About.objects.filter(profile=profile)
        return About.objects.none()

    def list(self, request, *args, **kwargs):
        profile = Profile.objects.first()
        if not profile:
            return Response({}, status=status.HTTP_200_OK)

        about = getattr(profile, "about", None)
        if not about:
            return Response({}, status=status.HTTP_200_OK)

        serializer = self.get_serializer(about)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        profile = Profile.objects.first()
        if not profile:
            return Response(
                {"detail": "Profile does not exist"}, status=status.HTTP_400_BAD_REQUEST
            )

        if hasattr(profile, "about"):
            return Response(
                {"detail": "About already exists. Use PUT instead."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(profile=profile)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class HeroViewSet(RoleProtectedViewSet):
    serializer_class = HeroSerializer

    queryset = Hero.objects.all().order_by("order")

    def retrieve(self, request, pk=None):
        hero = Hero.objects.first()
        if not hero:
            return Response({}, status=404)
        serializer = HeroSerializer(hero)
        return Response(serializer.data)

    def list(self, request):
        hero = Hero.objects.first()
        serializer = HeroSerializer(hero)
        return Response([serializer.data])

    def update(self, request, pk=None):
        hero = Hero.objects.first()
        if not hero:
            return Response({}, status=404)
        serializer = HeroSerializer(hero, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class FeaturedProjectViewSet(RoleProtectedViewSet):
    queryset = FeaturedProject.objects.all().order_by("id")

    serializer_class = FeaturedProjectSerializer


# skill items managed via nested serializers in SkillCategorySerializer
class SkillCategoryViewSet(RoleProtectedViewSet):
    queryset = SkillCategory.objects.prefetch_related("skills").order_by("order")
    serializer_class = SkillCategorySerializer


class SoftSkillViewSet(RoleProtectedViewSet):
    queryset = SoftSkill.objects.all().order_by("order", "skill")
    serializer_class = SoftSkillSerializer


class ArchitectureViewSet(RoleProtectedViewSet):
    queryset = Architecture.objects.all().order_by("-id")
    serializer_class = ArchitectureSerializer

    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def parse_nested_json(self, data):
        data = data.copy()

        if "services" in data and isinstance(data["services"], str):
            data["services"] = json.loads(data["services"])

        if "links" in data and isinstance(data["links"], str):
            data["links"] = json.loads(data["links"])

        return data

    def create(self, request, *args, **kwargs):
        data = self.parse_nested_json(request.data)
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        data = self.parse_nested_json(request.data)

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class ArticleViewSet(RoleProtectedViewSet):
    queryset = Article.objects.all().order_by("-created_at")  # latest first
    serializer_class = ArticleSerializer
    parser_classes = [JSONParser]


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_staff": user.is_staff,
                "role": user.profile.role if hasattr(user, "profile") else None,
                "is_superuser": user.is_superuser,
            }
        )


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


logger = logging.getLogger(__name__)


# Helper to get username from JSON request
def get_username(request):
    try:
        return request.data.get("username")
    except Exception:
        return None


# @method_decorator(ratelimit(key="ip", rate="10/m", block=True), name="post")
# @method_decorator(ratelimit(key=get_username, rate="4/m", block=True), name="post")
# from django_ratelimit.decorators import ratelimit
# from rest_framework_simplejwt.views import TokenObtainPairView
# from rest_framework.response import Response
# from django.utils.decorators import method_decorator


# Helper to get username from POST data
def get_username(request):
    return request.data.get("username") or "anon"


@method_decorator(
    ratelimit(key="ip", rate="10/m", method="POST", block=True), name="post"
)
@method_decorator(
    ratelimit(key=get_username, rate="4/m", method="POST", block=True), name="post"
)
class LoginView(TokenObtainPairView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            # Any invalid credentials will return 401
            return Response({"detail": "Invalid credentials"}, status=401)

        response = super().post(request, *args, **kwargs)
        refresh = response.data.get("refresh")
        access = response.data.get("access")

        # Set refresh token as HttpOnly cookie
        response.set_cookie(
            key="refresh_token",
            value=refresh,
            httponly=True,
            secure=False,  # set True in production
            samesite="lax",
        )

        # Only return access token in JSON
        response.data = {"access": access}
        return response


class CookieTokenRefreshView(TokenRefreshView):

    def post(self, request, *args, **kwargs):
        request.data["refresh"] = request.COOKIES.get("refresh_token")
        return super().post(request, *args, **kwargs)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_user(request):
    username = request.data.get("username")
    password = request.data.get("password")
    email = request.data.get("email")
    first_name = request.data.get("first_name", "")
    last_name = request.data.get("last_name", "")
    role = request.data.get("role")

    # Required fields check
    if not username or not password or not email or not role:
        return Response(
            {"detail": "Username, password, email, and role are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Username uniqueness check
    if User.objects.filter(username=username).exists():
        return Response(
            {"detail": "Username already exists."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Email uniqueness check
    if User.objects.filter(email=email).exists():
        return Response(
            {"detail": "Email already exists."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Password strength check (basic)
    if len(password) < 8:
        return Response(
            {"detail": "Password must be at least 8 characters long."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Role validation
    if role not in ["admin", "editor", "viewer"]:
        return Response(
            {"detail": "Invalid role."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Create user
    user = User.objects.create_user(
        username=username,
        password=password,
        email=email,
        first_name=first_name,
        last_name=last_name,
    )

    profile = user.profile
    profile.role = role
    profile.save()

    return Response(
        {"detail": "User created successfully."},
        status=status.HTTP_201_CREATED,
    )


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not user.check_password(serializer.validated_data["old_password"]):
            return Response(
                {"detail": "Old password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(new_password) < 8:
            return Response(
                {"detail": "New password must be at least 8 characters long."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()

        return Response({"detail": "Password changed successfully."})


def health(request):
    return JsonResponse({"status": "ok"})
