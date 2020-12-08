from rest_framework import serializers
from poll.models import PollModel, QuestionModel, UserAuthModel, AnswerModel


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionModel
        fields = ["id", "title", "questionData", "questionType", "pollObj"]

class PollSerializer(serializers.ModelSerializer):
    pollData = QuestionSerializer(read_only=True, many=True)

    class Meta:
        model = PollModel
        fields = ["id", "pollData", "title", "description"]

class UserAuthSeralizer(serializers.ModelSerializer):
    class Meta:
        model = UserAuthModel
        fields = ["id"]

class AnswerSerializer(serializers.ModelSerializer):
    userData = UserAuthSeralizer(read_only=True, many=True)
    pollDataAnswer = PollSerializer(read_only=True, many=True)
    class Meta:
        model = AnswerModel
        fields = "__all__"
