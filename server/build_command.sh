#!/bin/bash
# Install dependencies
pip install -r requirements.txt

# Make sure wsgi.py is in the correct location
echo "Checking for wsgi.py..."
if [ ! -f "wsgi.py" ]; then
  echo "Creating wsgi.py..."
  echo "from app import app" > wsgi.py
  echo "" >> wsgi.py
  echo "if __name__ == \"__main__\":" >> wsgi.py
  echo "    app.run()" >> wsgi.py
fi

# Print directory contents for debugging
echo "Directory contents:"
ls -la
