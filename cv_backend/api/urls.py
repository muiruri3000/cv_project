from rest_framework.routers import DefaultRouter
from . import views
from .views import (
    ArticleViewSet,
    PublicProfileViewSet,
    ExperienceViewSet,
    AboutViewSet,
    EducationViewSet,
    HeroViewSet,
    FeaturedProjectViewSet,
    SkillCategoryViewSet,
    SoftSkillViewSet,
    ArchitectureViewSet,
    MeView,
    ChangePasswordView,
)
from django.urls import path

router = DefaultRouter()
router.register("profile", PublicProfileViewSet, basename="profile")
router.register("experiences", ExperienceViewSet, basename="experiences")
router.register("education", EducationViewSet, basename="education")
router.register("about", AboutViewSet, basename="about")
router.register("hero", HeroViewSet, basename="hero")
router.register(
    r"featured-projects", FeaturedProjectViewSet, basename="featuredproject"
)
router.register("skills", SkillCategoryViewSet, basename="skills")
router.register(r"soft-skills", SoftSkillViewSet, basename="soft-skill")
router.register(r"architectures", ArchitectureViewSet)
router.register(r"articles", ArticleViewSet, basename="article")

urlpatterns = router.urls + [
    path("me/", MeView.as_view(), name="me"),
    path("create-user/", views.create_user, name="create_user"),
    path("change-password/", ChangePasswordView.as_view(), name="change_password"),
    path("health/", views.health, name="health"),
]
