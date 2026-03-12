from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    name = models.CharField(max_length=120)
    title = models.CharField(max_length=120)
    interestStatement = models.TextField()
    location = models.CharField(max_length=120)
    email = models.EmailField()
    github = models.URLField(blank=True)
    linkedIn = models.URLField(blank=True)
    resumeLink = models.URLField(blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class UserProfile(models.Model):

    class Role(models.TextChoices):
        VIEWER = "VIEWER", "Viewer"
        EDITOR = "EDITOR", "Editor"
        ADMIN = "ADMIN", "Admin"

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=120, choices=Role.choices, default=Role.VIEWER)

    def __str__(self):
        return f"{self.user.username} - {self.role}"


class Experience(models.Model):
    profile = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name="experiences"
    )
    company = models.CharField(max_length=120)
    role = models.CharField(max_length=120)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField()

    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]


class Duty(models.Model):
    experience = models.ForeignKey(
        Experience, on_delete=models.CASCADE, related_name="duties"
    )
    description = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]


class Education(models.Model):
    profile = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name="education"
    )
    institution = models.CharField(max_length=120)
    qualification = models.CharField(max_length=120)
    start_year = models.PositiveIntegerField()
    end_year = models.PositiveIntegerField(null=True, blank=True)

    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]


class Skill(models.Model):
    name = models.CharField(max_length=80, unique=True)

    def __str__(self):
        return self.name


class ProfileSkill(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)


class About(models.Model):
    profile = models.OneToOneField(
        Profile, on_delete=models.CASCADE, related_name="about"
    )
    headline = models.CharField(max_length=200)
    summary = models.TextField(blank=True)

    def __str__(self):
        return self.headline


class AboutParagraph(models.Model):
    about = models.ForeignKey(
        About, on_delete=models.CASCADE, related_name="paragraphs"
    )
    content = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]


class CoreStrength(models.Model):
    about = models.ForeignKey(
        About, on_delete=models.CASCADE, related_name="core_strengths"
    )
    pillar = models.CharField(max_length=120)
    description = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]


class Hero(models.Model):
    heading = models.CharField(max_length=255, blank=True)
    subheading = models.CharField(max_length=255, blank=True)
    cta_text = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.heading or "Hero Section"


class FeaturedProject(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    features = models.TextField(blank=True)
    demo_link = models.URLField(blank=True)
    github = models.URLField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    def save(self, *args, **kwargs):
        if self.is_featured:
            # Ensure only one project is featured
            FeaturedProject.objects.filter(is_featured=True).update(is_featured=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class SkillCategory(models.Model):
    category = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.category


class SkillItem(models.Model):
    category = models.ForeignKey(
        SkillCategory, related_name="skills", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name


from django.db import models


class SoftSkill(models.Model):
    skill = models.CharField(max_length=100, unique=True)
    description = models.TextField()

    order = models.PositiveIntegerField(default=0)  # optional: for sorting

    def __str__(self):
        return self.skill


class Architecture(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="architectures/", blank=True, null=True)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.title


class ArchitectureService(models.Model):
    architecture = models.ForeignKey(
        Architecture, related_name="services", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=255)
    order = models.IntegerField(default=0)


class ArchitectureLink(models.Model):
    architecture = models.ForeignKey(
        Architecture, related_name="links", on_delete=models.CASCADE
    )
    label = models.CharField(max_length=100)
    href = models.URLField()
    order = models.IntegerField(default=0)


class Article(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    body = models.TextField()
    tags = models.CharField(max_length=255, blank=True)  # comma-separated tags
    slug = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
