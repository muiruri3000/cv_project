from django.contrib import admin
from .models import Profile, Education, Experience, Skill, ProfileSkill,UserProfile


admin.site.register(Profile)
admin.site.register(Education)
admin.site.register(Experience)
admin.site.register(Skill)
admin.site.register(ProfileSkill)

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role')
    list_filter = ('role',)
    list_editable = ('role',)
    search_fields = ('user__username', 'user__email')
admin.site.register(UserProfile, UserProfileAdmin)

class UserProfileAdmin(admin.ModelAdmin):
    print("UserProfileAdmin loaded")  