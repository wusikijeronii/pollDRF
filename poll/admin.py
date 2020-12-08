from django.contrib import admin
from poll.models import PollModel, QuestionModel, UserAuthModel, AnswerModel

# Register your models here.

admin.site.register(PollModel)
admin.site.register(QuestionModel)
admin.site.register(UserAuthModel)
admin.site.register(AnswerModel)