from django.shortcuts import render
from django.http import JsonResponse
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os
from .boq_merger import BOQMerger  # Your merger class


def index(request):
    return render(request, 'chatapp/index.html')

def Login(request):
    return render(request, 'chatapp/login.html')

def tender_analysis(request):
    """
    Handle tender analysis file uploads
    Expects 3 files: Template, BOQ1, BOQ2
    """
    if request.method == "GET":
        return render(request, "chatapp/index.html")

    if request.method == "POST":
        print("\n" + "="*60)
        print("📥 TENDER ANALYSIS REQUEST RECEIVED")
        print("="*60)
        
        message = request.POST.get("message", "")
        upload_source = request.POST.get("upload_source")
        files = request.FILES.getlist("files")
        
        print(f"Message: {message}")
        print(f"Upload Source: {upload_source}")
        print(f"Files Received: {len(files)}")
        
        # Validate file count
        if len(files) != 3:
            return JsonResponse({
                "success": False,
                "error": f"Expected 3 files (Template, BOQ1, BOQ2), but received {len(files)} files.",
                "response": "❌ Please upload exactly 3 Excel files: Template, BOQ1, and BOQ2"
            }, status=400)
        
        # Setup file storage
        # upload_dir = os.path.join(settings.MEDIA_ROOT, 'tender_uploads')
        # os.makedirs(upload_dir, exist_ok=True)

        # Old code:
# upload_dir = os.path.join(settings.MEDIA_ROOT, 'tender_uploads')

# Change to this:
        upload_dir = os.path.join('/tmp', 'tender_uploads')
        os.makedirs(upload_dir, exist_ok=True)

        
        fs = FileSystemStorage(location=upload_dir)
        saved_paths = []
        
        # Save all uploaded files
        for idx, file in enumerate(files):
            filename = fs.save(file.name, file)
            full_path = os.path.join(upload_dir, filename)
            saved_paths.append(full_path)
            print(f"  ✓ File {idx+1}: {file.name} ({file.size} bytes)")
        
        # Assign files (assuming order: Template, BOQ1, BOQ2)
        template_file = saved_paths[0]
        boq1_file = saved_paths[1]
        boq2_file = saved_paths[2]
        
        # Generate output filename
        output_filename = 'Merged_BOQ_Output.xlsx'
        output_path = os.path.join(upload_dir, output_filename)
        
        print("\n🔧 Starting BOQ Merge Process...")
        print(f"  Template: {os.path.basename(template_file)}")
        print(f"  BOQ 1: {os.path.basename(boq1_file)}")
        print(f"  BOQ 2: {os.path.basename(boq2_file)}")
        
        try:
            # Initialize BOQ Merger
            merger = BOQMerger(template_file)
            
            # Perform merge
            merger.merge_two_boqs(boq1_file, boq2_file)
            
            # Save output
            merger.save(output_path)
            
            # Generate download URL - FIXED PATH
            output_url = '/media/tender_uploads/' + output_filename
            
            print(f"\n📁 Output saved to: {output_path}")
            print(f"🔗 Download URL: {output_url}")
            print("\n" + "="*60)
            print("✅ BOQ MERGE SUCCESSFUL!")
            print("="*60)
            
            return JsonResponse({
                "success": True,
                "response": "✅ BOQ files merged successfully! Click below to download the comparison file.",
                "message": message,
                "upload_source": upload_source,
                "files": [output_url],
                "output_file": output_filename
            })
            
        except Exception as e:
            print(f"\n❌ ERROR during merge: {str(e)}")
            import traceback
            traceback.print_exc()
            
            return JsonResponse({
                "success": False,
                "error": str(e),
                "response": f"❌ Error during merge: {str(e)}"
            }, status=500)