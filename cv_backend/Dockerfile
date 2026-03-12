# 1️⃣ Base image
FROM python:3.12-slim

# 2️⃣ Update apt and install netcat first


WORKDIR /app

# 3️⃣ Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
        curl && \
    rm -rf /var/lib/apt/lists/*

# 4️⃣ Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5️⃣ Copy project files
COPY . .

# 6️⃣ Copy entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# 7️⃣ Expose port
EXPOSE 8000

# 8️⃣ Use entrypoint
ENTRYPOINT ["/entrypoint.sh"]