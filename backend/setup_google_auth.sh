echo "Setting up Google Authentication for Number Ninja"
echo "------------------------------------------------"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Creating .env file..."
  touch .env
else
  echo "Found existing .env file"
fi

# Ask for Google Client ID
echo ""
echo "Enter your Google Client ID (from Google Cloud Console):"
read google_client_id

# Add/update GOOGLE_CLIENT_ID in .env
if grep -q "GOOGLE_CLIENT_ID" .env; then
  # Replace existing entry
  sed -i "s|GOOGLE_CLIENT_ID=.*|GOOGLE_CLIENT_ID=$google_client_id|g" .env
else
  # Add new entry
  echo "GOOGLE_CLIENT_ID=$google_client_id" >> .env
fi

echo ""
echo "Google Client ID has been saved to .env file"
echo ""
echo "Next steps:"
echo "1. Run database migrations: flask db upgrade"
echo "2. Update your frontend GoogleAuth.js with the same Client ID"
echo "3. Restart your Flask backend: flask run"
echo ""
echo "Setup complete!"
