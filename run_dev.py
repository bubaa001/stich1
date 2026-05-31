import subprocess
import sys
import os
import time

def main():
    # Detect virtualenv python executable path
    if os.name == 'nt':
        python_bin = os.path.join('.venv', 'Scripts', 'python.exe')
    else:
        python_bin = os.path.join('.venv', 'bin', 'python')
    
    if not os.path.exists(python_bin):
        python_bin = sys.executable

    print(f"Using Python binary: {python_bin}")
    print("Starting Django backend on http://127.0.0.1:8000...")
    django_proc = subprocess.Popen([python_bin, 'manage.py', 'runserver', '127.0.0.1:8000'])

    print("Starting Vite frontend on http://localhost:3000...")
    use_shell = os.name == 'nt'
    vite_proc = subprocess.Popen(['npx', 'vite', '--port', '3000'], shell=use_shell)

    try:
        # Keep the script running to monitor child processes
        while True:
            # Check if any process terminated unexpectedly
            django_status = django_proc.poll()
            vite_status = vite_proc.poll()
            
            if django_status is not None:
                print(f"Django process exited with code {django_status}")
                break
            if vite_status is not None:
                print(f"Vite process exited with code {vite_status}")
                break
                
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nKeyboardInterrupt detected. Stopping development servers...")
    finally:
        # Ensure cleanup of both processes
        print("Terminating Django backend...")
        django_proc.terminate()
        print("Terminating Vite frontend...")
        vite_proc.terminate()
        
        # Wait to ensure they exit
        django_proc.wait()
        vite_proc.wait()
        print("All servers stopped successfully.")

if __name__ == '__main__':
    main()
