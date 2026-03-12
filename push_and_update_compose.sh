#!/bin/bash
set -e

# --- Prompt for Docker Hub login ---
read -p "Docker Hub Username: " DOCKER_USER
read -sp "Docker Hub Password: " DOCKER_PASS
echo ""

# Login to Docker Hub
echo "$DOCKER_PASS" | docker login --username "$DOCKER_USER" --password-stdin

# Default image names
BACKEND_NAME="cv-backend"
FRONTEND_NAME="cv-frontend"

# Check if jq is installed
if ! command -v jq &> /dev/null
then
    echo "jq not found. Please install it first (sudo apt install jq)"
    exit 1
fi

# --- Ask which service(s) to update ---
echo "Which service do you want to update?"
echo "1) Backend"
echo "2) Frontend"
echo "3) Both"
read -p "Enter 1, 2, or 3: " SERVICE_CHOICE

UPDATE_BACKEND=false
UPDATE_FRONTEND=false

case $SERVICE_CHOICE in
  1) UPDATE_BACKEND=true ;;
  2) UPDATE_FRONTEND=true ;;
  3) UPDATE_BACKEND=true; UPDATE_FRONTEND=true ;;
  *) echo "Invalid choice"; exit 1 ;;
esac

# --- Function to get next version ---
get_next_version() {
  IMAGE=$1
  LATEST=$(curl -s https://hub.docker.com/v2/repositories/$DOCKER_USER/$IMAGE/tags/ | jq -r '.results[0].name')
  [ "$LATEST" = "null" ] && LATEST="v0"
  echo "v$(( ${LATEST#v} + 1 ))"
}

# --- Build & Push Backend ---
if [ "$UPDATE_BACKEND" = true ]; then
  VERSION_BACKEND=$(get_next_version $BACKEND_NAME)
  echo "Building backend version $VERSION_BACKEND..."
  docker build -t $DOCKER_USER/$BACKEND_NAME:$VERSION_BACKEND ./cv_backend
  echo "Pushing backend..."
  docker push $DOCKER_USER/$BACKEND_NAME:$VERSION_BACKEND

  # Update docker-compose.yaml
  sed -i "s|image:.*$BACKEND_NAME:.*|image: $DOCKER_USER/$BACKEND_NAME:$VERSION_BACKEND|g" docker-compose.yaml
  echo "✅ docker-compose.yaml updated with backend version $VERSION_BACKEND"
fi

# --- Build & Push Frontend ---
if [ "$UPDATE_FRONTEND" = true ]; then
  VERSION_FRONTEND=$(get_next_version $FRONTEND_NAME)
  echo "Building frontend version $VERSION_FRONTEND..."
  docker build -t $DOCKER_USER/$FRONTEND_NAME:$VERSION_FRONTEND ./my-react-app-parcel
  echo "Pushing frontend..."
  docker push $DOCKER_USER/$FRONTEND_NAME:$VERSION_FRONTEND

  # Update docker-compose.yaml
  sed -i "s|image:.*$FRONTEND_NAME:.*|image: $DOCKER_USER/$FRONTEND_NAME:$VERSION_FRONTEND|g" docker-compose.yaml
  echo "✅ docker-compose.yaml updated with frontend version $VERSION_FRONTEND"
fi

echo "✅ Done!"
[ "$UPDATE_BACKEND" = true ] && echo "Backend: $DOCKER_USER/$BACKEND_NAME:$VERSION_BACKEND"
[ "$UPDATE_FRONTEND" = true ] && echo "Frontend: $DOCKER_USER/$FRONTEND_NAME:$VERSION_FRONTEND"