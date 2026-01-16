from django.urls import path
from . import views
app_name = 'chatapp'

urlpatterns = [
    path('',views.index,name='index'),
    path('login/',views.Login,name='login'),
    path('tender-analysis/', views.tender_analysis, name='tender_analysis'),
    path('chat/', views.chat, name='chat'),
   
]