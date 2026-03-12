from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import (
    Profile,
    Experience,
    About,
    Duty,
    Education,
    Skill,
    AboutParagraph,
    CoreStrength,
    Hero,
    FeaturedProject,
    SkillItem,
    SkillCategory,
    SoftSkill,
    Architecture,
    ArchitectureService,
    ArchitectureLink,
    Article,
    UserProfile,
)
import json


class DutySerializer(serializers.ModelSerializer):
    class Meta:
        model = Duty
        fields = ["id", "description", "order"]


class ExperienceSerializer(serializers.ModelSerializer):
    duties = DutySerializer(many=True, required=False)

    class Meta:
        model = Experience
        fields = "__all__"
        read_only_fields = ["profile"]

    def create(self, validated_data):
        duties_data = validated_data.pop("duties", [])
        exp = Experience.objects.create(**validated_data)
        for i, duty in enumerate(duties_data):
            Duty.objects.create(experience=exp, order=i, **duty)
        return exp

    def update(self, instance, validated_data):
        duties_data = validated_data.pop("duties", [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Clear and recreate duties
        instance.duties.all().delete()
        for i, duty in enumerate(duties_data):
            Duty.objects.create(experience=instance, order=i, **duty)
        return instance


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["name"]


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = "__all__"
        read_only_fields = ["profile"]


class ProfileSerializer(serializers.ModelSerializer):
    experiences = ExperienceSerializer(many=True, read_only=True)
    education = EducationSerializer(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = "__all__"


class AboutParagraphSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutParagraph
        fields = ["id", "content", "order"]


class CoreStrengthSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoreStrength
        fields = ["id", "pillar", "description", "order"]


class AboutSerializer(serializers.ModelSerializer):
    paragraphs = AboutParagraphSerializer(many=True)
    core_strengths = CoreStrengthSerializer(many=True)

    class Meta:
        model = About
        fields = [
            "id",
            "headline",
            "summary",
            "paragraphs",
            "core_strengths",
        ]

    def create(self, validated_data):
        paragraphs_data = validated_data.pop("paragraphs", [])
        strengths_data = validated_data.pop("core_strengths", [])

        about = About.objects.create(**validated_data)

        for i, p in enumerate(paragraphs_data):
            p.pop("order", None)
            AboutParagraph.objects.create(about=about, order=i, **p)

        for i, s in enumerate(strengths_data):
            s.pop("order", None)
            CoreStrength.objects.create(about=about, order=i, **s)

        return about

    def update(self, instance, validated_data):
        paragraphs_data = validated_data.pop("paragraphs", [])
        strengths_data = validated_data.pop("core_strengths", [])

        # Update main About fields
        instance.headline = validated_data.get("headline", instance.headline)
        instance.summary = validated_data.get("summary", instance.summary)
        instance.save()

        # Replace paragraphs
        instance.paragraphs.all().delete()
        for i, p in enumerate(paragraphs_data):
            p.pop("order", None)  # remove order if it exists
            AboutParagraph.objects.create(about=instance, order=i, **p)

        # Replace core strengths
        instance.core_strengths.all().delete()
        for i, s in enumerate(strengths_data):
            s.pop("order", None)
            CoreStrength.objects.create(about=instance, order=i, **s)

        return instance


class HeroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hero
        fields = "__all__"


class FeaturedProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeaturedProject
        updated_at = serializers.ReadOnlyField()
        fields = "__all__"


class SkillItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillItem
        fields = ["id", "name"]


class SkillCategorySerializer(serializers.ModelSerializer):
    skills = SkillItemSerializer(many=True)

    class Meta:
        model = SkillCategory
        fields = ["id", "category", "order", "skills"]

    def create(self, validated_data):
        skills_data = validated_data.pop("skills", [])
        category = SkillCategory.objects.create(**validated_data)

        for i, skill in enumerate(skills_data):
            SkillItem.objects.create(category=category, order=i, **skill)

        return category

    def update(self, instance, validated_data):
        skills_data = validated_data.pop("skills", [])

        instance.category = validated_data.get("category", instance.category)
        instance.order = validated_data.get("order", instance.order)
        instance.save()

        instance.skills.all().delete()
        for i, skill in enumerate(skills_data):
            SkillItem.objects.create(category=instance, order=i, **skill)

        return instance


class SoftSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoftSkill
        fields = ["id", "skill", "description", "order"]


class ArchitectureServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArchitectureService
        fields = ["id", "name", "order"]


class ArchitectureLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArchitectureLink
        fields = ["id", "label", "href", "order"]


class ArchitectureSerializer(serializers.ModelSerializer):
    services = ArchitectureServiceSerializer(many=True, required=False)
    links = ArchitectureLinkSerializer(many=True, required=False)

    class Meta:
        model = Architecture
        fields = [
            "id",
            "title",
            "description",
            "image",
            "order",
            "services",
            "links",
        ]

    def to_internal_value(self, data):
        # Convert JSON strings into Python lists if necessary
        for key in ["services", "links"]:
            val = data.get(key)
            if isinstance(val, list):
                # Sometimes multipart sends repeated keys; take first
                try:
                    val = [json.loads(v) if isinstance(v, str) else v for v in val]
                    data[key] = val[0] if len(val) == 1 else val
                except Exception:
                    data[key] = []
            elif isinstance(val, str) and val.strip():
                try:
                    data[key] = json.loads(val)
                except json.JSONDecodeError:
                    data[key] = []
            else:
                data[key] = []
        return super().to_internal_value(data)

    def create(self, validated_data):
        services_data = validated_data.pop("services", [])
        links_data = validated_data.pop("links", [])

        architecture = Architecture.objects.create(**validated_data)

        for idx, service in enumerate(services_data):
            service.pop("order", None)
            ArchitectureService.objects.create(
                architecture=architecture, order=idx, **service
            )

        for idx, link in enumerate(links_data):
            link.pop("order", None)
            ArchitectureLink.objects.create(
                architecture=architecture, order=idx, **link
            )

        return architecture

    def update(self, instance, validated_data):
        services_data = validated_data.pop("services", [])
        links_data = validated_data.pop("links", [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        instance.services.all().delete()
        instance.links.all().delete()

        for idx, service in enumerate(services_data):
            service.pop("order", None)
            ArchitectureService.objects.create(
                architecture=instance, order=idx, **service
            )

        for idx, link in enumerate(links_data):
            link.pop("order", None)
            ArchitectureLink.objects.create(architecture=instance, order=idx, **link)

        return instance


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "description",
            "body",
            "tags",
            "slug",
            "created_at",
            "updated_at",
        ]


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["username"] = user.username
        token["role"] = user.profile.role if hasattr(user, "profile") else None
        return token


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["id", "role", "user"]


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
