#!/bin/bash
# Run the application with Gunicorn
gunicorn wsgi:app
