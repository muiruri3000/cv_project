from django.apps import AppConfig


class ApiConfig(AppConfig):
    name = "api"

    def ready(self):
        import api.signals  # Import signals to ensure they are registered
