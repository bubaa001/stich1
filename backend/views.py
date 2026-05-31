import os
import json
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .gemini import generate_math_hint

def health_check(request):
    mode = os.environ.get("NODE_ENV", "development")
    return JsonResponse({"status": "ok", "mode": mode})

@csrf_exempt
def gemini_generate(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
        
    prompt = body.get('prompt')
    system_instruction = body.get('systemInstruction')
    
    if not prompt:
        return JsonResponse({"error": "Missing prompt parameter."}, status=400)
        
    result = generate_math_hint(prompt, system_instruction)
    return JsonResponse(result)

def catch_all(request, path=''):
    # In production, dist/index.html is created by npm run build
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dist_index = os.path.join(os.path.dirname(current_dir), 'dist', 'index.html')
    
    if os.path.exists(dist_index):
        with open(dist_index, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read(), content_type='text/html')
    else:
        return HttpResponse(
            "<h3>Vite build not found.</h3>"
            "<p>If in production, run <code>npm run build</code> first.</p>"
            "<p>If in development, run the dev server via <code>npm run dev</code> and visit "
            "<a href='http://localhost:3000'>http://localhost:3000</a>.</p>",
            status=404
        )
