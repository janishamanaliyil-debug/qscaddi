from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
from django.http import JsonResponse
# Create your views here.
def index(request):
    if request.method == 'POST':
        message = request.POST.get('message', '')
        files = request.FILES.getlist('files')  # get all files

        fs = FileSystemStorage()
        file_urls = []
        for f in files:
            filename = fs.save(f.name, f)
            file_urls.append(fs.url(filename))

        # You can also save the message to DB here

        return JsonResponse({'message': message, 'files': file_urls})
    return render(request,'chatapp/index.html')

def Login(request):
    return render(request,'chatapp/login.html')

