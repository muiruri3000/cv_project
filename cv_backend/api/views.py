import logging

from django.http import JsonResponse
from django.contrib.auth.models import User

from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from rest_framework.permissions import BasePermission

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator

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
)

from .serializers import (
    ProfileSerializer,
    ExperienceSerializer,
    EducationSerializer,
    AboutSerializer,
    HeroSerializer,
    SkillCategorySerializer,
    FeaturedProjectSerializer,
    SoftSkillSerializer,
    ArchitectureSerializer,
    ArticleSerializer,
    MyTokenObtainPairSerializer,
    UserSerializer,
    ChangePasswordSerializer,
)

logger = logging.getLogger(__name__)

# =========================================================
# SIMPLE PERMISSION (SAFE FOR SINGLE USER APP)
# =========================================================


class RoleBasedPermission(BasePermission):
    def has_permission(self, request, view):
        return True  # simplified for single-user system


class RoleProtectedViewSet(viewsets.ModelViewSet):
    permission_classes = [RoleBasedPermission]


# =========================================================
# PROFILE (SINGLE INSTANCE)
# =========================================================
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, request):
        profile, created = Profile.objects.get_or_create(user=request.user)
        return profile

    def get(self, request):
        profile = self.get_object(request)
        return Response(ProfileSerializer(profile).data)

    def put(self, request):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def patch(self, request):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


# =========================================================
# EXPERIENCE
# =========================================================


class ExperienceViewSet(RoleProtectedViewSet):
    serializer_class = ExperienceSerializer

    def get_queryset(self):
        profile = Profile.objects.first()
        if profile:
            return Experience.objects.filter(profile=profile)
        return Experience.objects.none()

    def perform_create(self, serializer):
        profile = Profile.objects.first()
        serializer.save(profile=profile)


# =========================================================
# EDUCATION
# =========================================================


class EducationViewSet(RoleProtectedViewSet):
    serializer_class = EducationSerializer

    def get_queryset(self):
        profile = Profile.objects.first()
        if profile:
            return Education.objects.filter(profile=profile)
        return Education.objects.none()

    def perform_create(self, serializer):
        profile = Profile.objects.first()
        serializer.save(profile=profile)


# =========================================================
# ABOUT
# =========================================================


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
            return Response({}, status=200)

        about = getattr(profile, "about", None)
        if not about:
            return Response({}, status=200)

        return Response(self.get_serializer(about).data)

    def create(self, request, *args, **kwargs):
        profile = Profile.objects.first()

        if not profile:
            return Response(
                {"detail": "Profile does not exist"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if hasattr(profile, "about"):
            return Response(
                {"detail": "About already exists. Use PUT instead."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(profile=profile)
        return Response(serializer.data, status=201)


# =========================================================
# HERO
# =========================================================


class HeroViewSet(RoleProtectedViewSet):
    queryset = Hero.objects.all().order_by("order")
    serializer_class = HeroSerializer


# =========================================================
# FEATURED PROJECT
# =========================================================


class FeaturedProjectViewSet(RoleProtectedViewSet):
    queryset = FeaturedProject.objects.all().order_by("id")
    serializer_class = FeaturedProjectSerializer


# =========================================================
# SKILLS
# =========================================================


class SkillCategoryViewSet(RoleProtectedViewSet):
    queryset = SkillCategory.objects.prefetch_related("skills").order_by("order")
    serializer_class = SkillCategorySerializer


# =========================================================
# SOFT SKILLS
# =========================================================


class SoftSkillViewSet(RoleProtectedViewSet):
    queryset = SoftSkill.objects.all().order_by("order")
    serializer_class = SoftSkillSerializer


# =========================================================
# ARCHITECTURE
# =========================================================


class ArchitectureViewSet(RoleProtectedViewSet):
    queryset = Architecture.objects.all().order_by("-id")
    serializer_class = ArchitectureSerializer


# =========================================================
# ARTICLES
# =========================================================


class ArticleViewSet(RoleProtectedViewSet):
    queryset = Article.objects.all().order_by("-created_at")
    serializer_class = ArticleSerializer


# =========================================================
# AUTH
# =========================================================


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class LoginView(TokenObtainPairView):
    permission_classes = []

    @method_decorator(ratelimit(key="ip", rate="10/m", method="POST", block=True))
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return Response({"detail": "Invalid credentials"}, status=401)

        response = super().post(request, *args, **kwargs)

        refresh = response.data.get("refresh")
        access = response.data.get("access")

        response.set_cookie(
            key="refresh_token",
            value=refresh,
            httponly=True,
            samesite="lax",
            secure=False,
        )

        response.data = {"access": access}
        return response


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        request.data["refresh"] = request.COOKIES.get("refresh_token")
        return super().post(request, *args, **kwargs)


# =========================================================
# USER
# =========================================================


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_user(request):
    username = request.data.get("username")
    password = request.data.get("password")
    email = request.data.get("email")

    if not username or not password or not email:
        return Response(
            {"detail": "Missing fields"},
            status=400,
        )

    if User.objects.filter(username=username).exists():
        return Response({"detail": "Username exists"}, status=400)

    user = User.objects.create_user(
        username=username,
        password=password,
        email=email,
    )

    return Response({"detail": "User created"}, status=201)


# =========================================================
# CHANGE PASSWORD
# =========================================================


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user

        if not user.check_password(serializer.validated_data["old_password"]):
            return Response({"detail": "Wrong password"}, status=400)

        user.set_password(serializer.validated_data["new_password"])
        user.save()

        return Response({"detail": "Password changed"})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = user.profile

        role = None
        if hasattr(user, "userprofile"):
            role = user.userprofile.role

        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
                "role": profile.role,
            }
        )


# =========================================================
# HEALTH CHECK
# =========================================================


def health(request):
    return JsonResponse({"status": "ok"})
