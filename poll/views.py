from django.shortcuts import render
from rest_framework import viewsets
from poll.serializers import PollSerializer, QuestionSerializer, UserAuthSeralizer, AnswerSerializer
from poll.models import PollModel, QuestionModel, UserAuthModel, AnswerModel
from rest_framework_swagger.views import get_swagger_view

# Create your views here.


class PollAPI(viewsets.ModelViewSet):
    queryset = PollModel.objects.all()
    serializer_class = PollSerializer


class QuestionAPI(viewsets.ModelViewSet):
    queryset = QuestionModel.objects.all()
    serializer_class = QuestionSerializer

class UserAuthAPI(viewsets.ModelViewSet):
    queryset = UserAuthModel.objects.all()
    serializer_class = UserAuthSeralizer


class AnswerAPI(viewsets.ModelViewSet):
    queryset = AnswerModel.objects.all()
    serializer_class = AnswerSerializer

def auth(request, *args, **kwargs):
    return render(request, "auth.html", {})

schema_view = get_swagger_view(title='Pastebin API')