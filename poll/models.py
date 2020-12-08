from django.db import models
from json_field import JSONField

# Create your models here.


class PollModel(models.Model):
    title = models.CharField(max_length=250)
    description = models.CharField(max_length=250)


class QuestionModel(models.Model):
    title = models.CharField(max_length=250)
    questionData = JSONField(null=True, default="0")
    questionTypes_ = ((0, "textbox"), (1, "radio"), (2, "checkbox"))
    questionType = models.IntegerField(choices=questionTypes_)
    pollObj = models.ForeignKey(PollModel, related_name="pollData", on_delete=models.CASCADE)

class UserAuthModel(models.Model): 
    pass


class AnswerModel(models.Model):
    userObjAnswer = models.ForeignKey(UserAuthModel, related_name="userData", on_delete=models.CASCADE)
    pollObjAnswer = models.ForeignKey(QuestionModel, related_name="pollDataAnswer", on_delete=models.CASCADE)
    answerData = JSONField(null=True, default="0")
    dataStart = models.CharField(default="", max_length=20)
    dataEnd= models.CharField(default="",max_length=20)