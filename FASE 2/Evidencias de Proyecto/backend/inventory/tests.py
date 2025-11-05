import json

from django.contrib.auth import get_user_model
from django.test import TestCase

from .models import Item


class InventoryAuthTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="manager", password="unsafe-but-tests"
        )
        self.list_url = "/api/inventory/items/"
        self.item = Item.objects.create(
            recurso="Proyector",
            categoria="AudioVisual",
            cantidad=5,
            precio="150000.00",
            info="Proyector HD",
        )

    def test_list_requires_authentication(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json()["detail"], "Authentication credentials were not provided."
        )

    def test_detail_requires_authentication(self):
        response = self.client.get(f"/api/inventory/items/{self.item.id}/")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json()["detail"], "Authentication credentials were not provided."
        )

    def test_create_requires_authentication(self):
        response = self.client.post(
            self.list_url,
            data=json.dumps(
                {
                    "recurso": "Laptop",
                    "categoria": "Computo",
                    "cantidad": 3,
                    "precio": "350000.00",
                    "info": "Laptop de respaldo",
                }
            ),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 401)

    def test_authenticated_user_can_read_and_modify(self):
        logged = self.client.login(username="manager", password="unsafe-but-tests")
        self.assertTrue(logged, "Sanity check: test client should authenticate.")

        list_response = self.client.get(self.list_url)
        self.assertEqual(list_response.status_code, 200)
        data = list_response.json()
        self.assertIn("results", data)
        self.assertEqual(len(data["results"]), 1)

        create_response = self.client.post(
            self.list_url,
            data=json.dumps(
                {
                    "recurso": "Laptop",
                    "categoria": "Computo",
                    "cantidad": 3,
                    "precio": "350000.00",
                    "info": "Laptop de respaldo",
                }
            ),
            content_type="application/json",
        )
        self.assertEqual(create_response.status_code, 201)
        created = create_response.json()
        self.assertEqual(created["recurso"], "Laptop")

        detail_response = self.client.put(
            f"/api/inventory/items/{created['id']}/",
            data=json.dumps({"cantidad": 7}),
            content_type="application/json",
        )
        self.assertEqual(detail_response.status_code, 200)
        self.assertEqual(detail_response.json()["cantidad"], 7)
