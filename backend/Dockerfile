# Dockerfile for DRF (Django)

# Use official Python image
FROM python:3.12

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /app

RUN pip install setuptools

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project files
COPY . .

# Collect static files
RUN mkdir -p /staticfiles /media
RUN python manage.py collectstatic --noinput
RUN python manage.py migrate
