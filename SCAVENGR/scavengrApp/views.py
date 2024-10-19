from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse
from django.http import JsonResponse
from django.http import Http404
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.
def main_page(request):
    return render(request, 'scavengr.html')