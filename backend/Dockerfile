FROM python:3.9-slim

WORKDIR /app

COPY setup.py .
RUN pip install .

COPY . .

EXPOSE 7123

CMD ["python", "index.py"]