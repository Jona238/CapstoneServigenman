from django.urls import path

from .views import (
    login_view,
    me_view,
    logout_view,
    request_password_code_view,
    reset_password_with_code_view,
    verify_password_code_view,
)

app_name = "accounts"

urlpatterns = [
    path("login/", login_view, name="login"),
    path("me/", me_view, name="me"),
    path("logout/", logout_view, name="logout"),
    # Accept with and without trailing slash to avoid POST + APPEND_SLASH redirect issues
    path("password/request/", request_password_code_view, name="password-request"),
    path("password/request", request_password_code_view),
    path("password/verify/", verify_password_code_view, name="password-verify"),
    path("password/verify", verify_password_code_view),
    path("password/reset/", reset_password_with_code_view, name="password-reset"),
    path("password/reset", reset_password_with_code_view),
]
