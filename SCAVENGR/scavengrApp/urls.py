from django.urls import path

from . import views

app_name = "Schools"
urlpatterns = [
    path("", views.main_page, name="main_page"),

    #path("<int:district_id>/", views.districts, name="district"),
    # ex: /polls/5/results/
]
