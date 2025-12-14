from django.contrib import admin

# Register your models here.
from .models import RehomingListing, PetDocument

admin.site.register(RehomingListing)
admin.site.register(PetDocument)

