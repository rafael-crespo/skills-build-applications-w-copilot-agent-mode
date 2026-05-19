"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

import os

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from octofit_tracker import views
from rest_framework.response import Response
from rest_framework.decorators import api_view


router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'teams', views.TeamViewSet)
router.register(r'activities', views.ActivityViewSet)
router.register(r'leaderboard', views.LeaderboardViewSet)
router.register(r'workouts', views.WorkoutViewSet)

def build_api_url(path: str) -> str:
    codespace_name = os.environ.get('CODESPACE_NAME')
    normalized = path.strip('/')
    if codespace_name:
        return f"https://{codespace_name}-8000.app.github.dev/{normalized}/"
    return f"/{normalized}/"


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'users': build_api_url('api/users'),
        'teams': build_api_url('api/teams'),
        'activities': build_api_url('api/activities'),
        'leaderboard': build_api_url('api/leaderboard'),
        'workouts': build_api_url('api/workouts'),
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
