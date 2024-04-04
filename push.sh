curl -X POST http://your-server-url/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "subscription": {
      "endpoint": "your_subscription_endpoint",
      "keys": {
        "p256dh": "your_p256dh_key",
        "auth": "your_auth_key"
      }
    }
  }'