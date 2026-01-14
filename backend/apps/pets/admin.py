from django.contrib import admin

# Register your models here.
from .models import PetProfile, PetMedia, PersonalityTrait, PetPersonality

admin.site.register(PetProfile)
admin.site.register(PetMedia)
admin.site.register(PersonalityTrait)
admin.site.register(PetPersonality)

