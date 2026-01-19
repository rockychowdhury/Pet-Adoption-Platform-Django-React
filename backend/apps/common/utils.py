from django.db.models import F, FloatField
from django.db.models.functions import ACos, Cos, Radians, Sin, Cast

def annotated_distance_queryset(queryset, latitude, longitude, lat_field='latitude', lon_field='longitude'):
    """
    Annotates the queryset with a 'distance' field calculated using the Haversine formula.
    Result is in kilometers.
    
    Args:
        queryset: The base Django queryset.
        latitude: Target latitude (float/decimal).
        longitude: Target longitude (float/decimal).
        lat_field: Name of the latitude field on the model (default 'latitude').
        lon_field: Name of the longitude field on the model (default 'longitude').
    """
    if latitude is None or longitude is None:
        return queryset

    rad_lat = Radians(float(latitude))
    rad_lon = Radians(float(longitude))
    
    # Haversine formula
    # d = 6371 * acos(cos(lat1) * cos(lat2) * cos(lon2 - lon1) + sin(lat1) * sin(lat2))
    
    lat_rad = Radians(Cast(F(lat_field), FloatField()))
    lon_rad = Radians(Cast(F(lon_field), FloatField()))
    
    expression = 6371 * ACos(
        Cos(rad_lat) * Cos(lat_rad) *
        Cos(lon_rad - rad_lon) +
        Sin(rad_lat) * Sin(lat_rad)
    )
    
    return queryset.annotate(distance=expression).order_by('distance')
